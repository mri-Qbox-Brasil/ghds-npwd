import React, { useCallback, useRef, useState } from 'react';
import { AppWrapper } from '@ui/components';
import { useApps } from '@os/apps/hooks/useApps';
import { useExternalApps } from '@common/hooks/useExternalApps';
import { useAppStore } from '@apps/store/hooks/useAppStore';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus } from 'lucide-react';
import { IApp } from '@os/apps/config/apps';

const LONG_PRESS_MS = 600;

const AppIconVisual: React.FC<{ item: IApp; name: string }> = ({ item, name }) => (
  <div className="flex flex-col items-center w-[90px] mb-6 select-none pointer-events-none">
    <div
      className="flex justify-center items-center rounded-[18px] overflow-hidden w-[64px] h-[64px]"
      style={{
        backgroundColor: item.backgroundColor,
        backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.2) 20%, transparent 90%)`,
      }}
    >
      <div className="w-full h-full overflow-hidden flex items-center justify-center">
        {item.icon}
      </div>
    </div>
    <span className="mt-1.5 text-[11px] text-white/90 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[70px] text-center [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
      {name}
    </span>
  </div>
);

export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const externalApps = useExternalApps();
  const { isInstalled, isEssential, uninstallApp, isLoaded, appOrder, setAppOrder } = useAppStore();
  const [t] = useTranslation();

  const [jiggling, setJiggling] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastTargetRef = useRef<string | null>(null);
  const insertCooldownRef = useRef<boolean>(false); // aguarda animação FLIP
  const orderedAppsRef = useRef<IApp[]>([]);

  const baseGridApps = apps?.filter((a) => {
    if (a.isDockApp) return false;
    if (a.isDisabled) return false;
    if (!isLoaded) return true;
    return isInstalled(a.id);
  }) ?? [];

  const sortedApps = [...baseGridApps, ...externalApps].sort((a, b) => {
    const ia = appOrder.indexOf(a.id);
    const ib = appOrder.indexOf(b.id);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  const [orderedApps, setOrderedApps] = useState<IApp[]>(sortedApps);
  orderedAppsRef.current = orderedApps;

  const prevKey = sortedApps.map((a) => a.id).join(',');
  const prevKeyRef = useRef('');
  if (prevKeyRef.current !== prevKey) {
    prevKeyRef.current = prevKey;
    setOrderedApps(sortedApps);
  }

  /* ── Find item under pointer (excluding the dragged one) ── */
  const findTargetId = useCallback((x: number, y: number, excludeId: string): string | null => {
    for (const [id, el] of Object.entries(itemRefs.current)) {
      if (id === excludeId || !el) continue;
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return id;
      }
    }
    return null;
  }, []);

  /* ── Insert helper (iOS style: shift, not swap) ── */
  const insertItem = useCallback((fromId: string, toId: string) => {
    const current = orderedAppsRef.current;
    const fromIdx = current.findIndex((a) => a.id === fromId);
    const toIdx = current.findIndex((a) => a.id === toId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    const next = [...current];
    const [removed] = next.splice(fromIdx, 1); // remove from origin
    next.splice(toIdx, 0, removed);             // insert at destination
    setOrderedApps(next);
    setAppOrder(next.map((a) => a.id));
  }, [setAppOrder]);

  /* ── Real-time insert on drag ── */
  const handleDragMove = useCallback((event: any, appId: string) => {
    // Bloqueia durante a animação FLIP do insert anterior
    if (insertCooldownRef.current) return;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const targetId = findTargetId(clientX, clientY, appId);

    if (!targetId || targetId === lastTargetRef.current) return;
    lastTargetRef.current = targetId;

    // Cooldown: aguarda a animação (130ms) + margem de segurança
    // Após o cooldown, reseta o target para permitir retornar a slots anteriores
    insertCooldownRef.current = true;
    setTimeout(() => {
      insertCooldownRef.current = false;
      lastTargetRef.current = null;
    }, 140);

    insertItem(appId, targetId);
  }, [findTargetId, insertItem]);

  /* ── Long press handlers ── */
  const startLongPress = useCallback(() => {
    longPressTimer.current = setTimeout(() => setJiggling(true), LONG_PRESS_MS);
  }, []);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const exitJiggle = useCallback(() => setJiggling(false), []);

  const handleDelete = useCallback(
    (e: React.MouseEvent | React.TouchEvent, appId: string) => {
      e.preventDefault();
      e.stopPropagation();
      uninstallApp(appId);
      setOrderedApps((prev) => prev.filter((a) => a.id !== appId));
    },
    [uninstallApp],
  );

  return (
    <AppWrapper>
      <div className="pt-[80px] px-[16px] relative">

        {/* ── Normal mode ── */}
        {!jiggling && (
          <div
            className="grid grid-cols-4 w-full"
            onMouseDown={startLongPress}
            onMouseUp={cancelLongPress}
            onMouseLeave={cancelLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={cancelLongPress}
            onTouchCancel={cancelLongPress}
          >
            {orderedApps.map((item) => {
              const name = t(item.nameLocale) as unknown as string;
              return (
                <div key={item.id} className="flex flex-col items-center pt-2">
                  <Link to={item.path} style={{ textDecoration: 'none' }}>
                    <motion.button
                      className="p-0 bg-transparent flex flex-col items-center text-center w-[90px] mb-6"
                      whileTap={{ scale: 0.88 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <div
                        className="flex justify-center items-center rounded-[18px] overflow-hidden w-[64px] h-[64px]"
                        style={{
                          backgroundColor: item.backgroundColor,
                          backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.2) 20%, transparent 90%)`,
                        }}
                      >
                        <div className="w-full h-full overflow-hidden flex items-center justify-center">
                          {item.icon}
                        </div>
                      </div>
                      <span className="mt-1.5 text-[11px] text-white/90 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[70px] text-center [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
                        {name}
                      </span>
                    </motion.button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Jiggle mode ── */}
        {jiggling && (
          <>
            <div className="grid grid-cols-4 w-full">
              {orderedApps.map((item) => {
                const name = t(item.nameLocale) as unknown as string;
                const removable = !isEssential(item.id);
                const isDragging = draggedId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    ref={(el: HTMLDivElement | null) => { itemRefs.current[item.id] = el; }}
                    layout={!isDragging}
                    transition={{ type: 'tween', duration: 0.13, ease: 'easeOut' }}
                    className="relative flex flex-col items-center pt-2"
                  >
                    {/* CSS jiggle wraps the icon — stops when dragging */}
                    <div className={isDragging ? undefined : 'animate-jiggle'}>
                      <motion.div
                        layoutId={isDragging ? undefined : item.id}
                        layout={!isDragging}
                        drag
                        dragSnapToOrigin
                        dragElastic={0.15}
                        dragMomentum={false}
                        whileDrag={{
                          scale: 1.25,
                          zIndex: 50,
                          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.45))',
                          cursor: 'grabbing',
                        }}
                        style={{ touchAction: 'none', position: 'relative', zIndex: isDragging ? 50 : 1 }}
                        onDragStart={() => {
                          setDraggedId(item.id);
                          lastTargetRef.current = null;
                          insertCooldownRef.current = false;
                        }}
                        onDrag={(e) => handleDragMove(e, item.id)}
                        onDragEnd={() => setDraggedId(null)}
                      >
                        <AppIconVisual item={item} name={name} />
                      </motion.div>
                    </div>

                    {/* × button */}
                    <AnimatePresence>
                      {removable && !isDragging && (
                        <motion.button
                          key={`del-${item.id}`}
                          className="absolute top-0 left-1 z-30 w-5 h-5 rounded-full bg-neutral-800/90 border border-white/20 flex items-center justify-center shadow-md"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          onClick={(e) => handleDelete(e, item.id)}
                          onTouchEnd={(e) => handleDelete(e, item.id)}
                        >
                          <Minus size={12} strokeWidth={3.5} className="text-white" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Concluir */}
            <motion.button
              className="absolute top-14 right-4 z-30 text-[16px] font-semibold text-blue-400 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={exitJiggle}
            >
              Concluir
            </motion.button>
          </>
        )}
      </div>
    </AppWrapper>
  );
};
