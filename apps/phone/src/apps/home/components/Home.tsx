import React, { useCallback, useRef, useState, useEffect } from 'react';
import { AppWrapper } from '@ui/components';
import { useApps } from '@os/apps/hooks/useApps';
import { useExternalApps } from '@common/hooks/useExternalApps';
import { useAppStore } from '@apps/store/hooks/useAppStore';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Minus } from 'lucide-react';
import { IApp } from '@os/apps/config/apps';
import { useJiggling } from '../state';

const LONG_PRESS_MS = 600;

const AppIconVisual: React.FC<{ item: IApp; name?: string; isDockItem?: boolean }> = ({ item, name, isDockItem }) => (
  <div className={`flex flex-col items-center select-none pointer-events-none ${isDockItem ? 'w-[64px]' : 'w-[90px] mb-6'}`}>
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
    {!isDockItem && name && (
      <span className="mt-1.5 text-[11px] text-white/90 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[70px] text-center [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
        {name}
      </span>
    )}
  </div>
);

export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const externalApps = useExternalApps();
  const { isInstalled, isEssential, uninstallApp, isLoaded, appOrder, setAppOrder, dockOrder, setDockOrder } = useAppStore();
  const [t] = useTranslation();

  const [jiggling, setJiggling] = useJiggling();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastTargetRef = useRef<string | null>(null);
  const insertCooldownRef = useRef<boolean>(false); // aguarda animação FLIP

  // Mapeia IDs para objetos IApp usando todas as fontes
  const allAvailableApps = [...apps, ...externalApps];
  const getAppById = useCallback((id: string) => allAvailableApps.find(a => a.id === id), [allAvailableApps]);

  // Base Grid Apps (filtra instalados)
  const installedApps = allAvailableApps.filter((a) => {
    if (a.isDisabled) return false;
    if (!isLoaded) return true;
    return isInstalled(a.id);
  });

  const sortedGridApps = installedApps
    .filter((a) => !dockOrder.includes(a.id))
    .sort((a, b) => {
      const ia = appOrder.indexOf(a.id);
      const ib = appOrder.indexOf(b.id);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

  const sortedDockApps = dockOrder
    .map((id) => getAppById(id))
    .filter(Boolean) as IApp[];

  const [orderedGrid, setOrderedGrid] = useState<IApp[]>(sortedGridApps);
  const [orderedDock, setOrderedDock] = useState<IApp[]>(sortedDockApps);

  const orderedGridRef = useRef<IApp[]>([]);
  const orderedDockRef = useRef<IApp[]>([]);
  orderedGridRef.current = orderedGrid;
  orderedDockRef.current = orderedDock;

  const prevGridKey = sortedGridApps.map((a) => a.id).join(',');
  const prevDockKey = sortedDockApps.map((a) => a.id).join(',');
  const prevKeyRef = useRef(`${prevGridKey}|${prevDockKey}`);

  useEffect(() => {
    const currentKey = `${prevGridKey}|${prevDockKey}`;
    if (prevKeyRef.current !== currentKey) {
      prevKeyRef.current = currentKey;
      setOrderedGrid(sortedGridApps);
      setOrderedDock(sortedDockApps);
    }
  }, [prevGridKey, prevDockKey, sortedGridApps, sortedDockApps]);

  useEffect(() => {
    return () => {
      setJiggling(false);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [setJiggling]);

  /* ── Find target under pointer ── */
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

  /* ── Insert/Swap logic between arrays ── */
  const insertItem = useCallback((fromId: string, toId: string) => {
    const grid = [...orderedGridRef.current];
    const dock = [...orderedDockRef.current];

    const gridFromIdx = grid.findIndex((a) => a.id === fromId);
    const dockFromIdx = dock.findIndex((a) => a.id === fromId);

    if (gridFromIdx === -1 && dockFromIdx === -1) return;

    const gridToIdx = grid.findIndex((a) => a.id === toId);
    const dockToIdx = dock.findIndex((a) => a.id === toId);

    let removedApp: IApp;

    // Remove from origin
    if (gridFromIdx !== -1) {
      const [r] = grid.splice(gridFromIdx, 1);
      removedApp = r;
    } else {
      const [r] = dock.splice(dockFromIdx, 1);
      removedApp = r;
    }

    // Insert at destination
    // If target is in grid:
    if (gridToIdx !== -1) {
      grid.splice(gridToIdx, 0, removedApp);
    }
    // If target is in dock:
    else if (dockToIdx !== -1) {
      dock.splice(dockToIdx, 0, removedApp);
      // Emulate iOS dock limit (max 4). Displace last item to grid if overflowing.
      if (dock.length > 4) {
        const displaced = dock.pop();
        if (displaced) grid.push(displaced);
      }
    }
    // Fallback: target not found (should not happen based on caller)
    else {
      return;
    }

    setOrderedGrid(grid);
    setOrderedDock(dock);
    setAppOrder(grid.map((a) => a.id));
    setDockOrder(dock.map((a) => a.id));
  }, [setAppOrder, setDockOrder]);

  const handleDragMove = useCallback((event: any, appId: string) => {
    if (insertCooldownRef.current) return;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const targetId = findTargetId(clientX, clientY, appId);

    if (!targetId || targetId === lastTargetRef.current) return;
    lastTargetRef.current = targetId;

    insertCooldownRef.current = true;
    setTimeout(() => {
      insertCooldownRef.current = false;
      lastTargetRef.current = null;
    }, 140);

    insertItem(appId, targetId);
  }, [findTargetId, insertItem]);

  /* ── Long press handlers ── */
  const startLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    longPressTimer.current = setTimeout(() => setJiggling(true), LONG_PRESS_MS);
  }, [setJiggling]);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const exitJiggle = useCallback(() => setJiggling(false), [setJiggling]);

  const handleDelete = useCallback(
    (e: React.MouseEvent | React.TouchEvent, appId: string) => {
      e.preventDefault();
      e.stopPropagation();
      uninstallApp(appId);
      setOrderedGrid((prev) => prev.filter((a) => a.id !== appId));
      setOrderedDock((prev) => prev.filter((a) => a.id !== appId));
    },
    [uninstallApp],
  );

  const renderItemContent = (item: IApp, isDockItem: boolean) => {
    const name = t(item.nameLocale) as unknown as string;
    const removable = !isEssential(item.id);
    const isDragging = draggedId === item.id;

    if (!jiggling) {
      return (
        <div key={item.id} className={isDockItem ? '' : 'flex flex-col items-center pt-2'}>
          <Link to={item.path} style={{ textDecoration: 'none' }}>
            <motion.button
              className="p-0 bg-transparent flex flex-col items-center"
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onMouseDown={startLongPress}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              onTouchStart={startLongPress}
              onTouchEnd={cancelLongPress}
              onTouchCancel={cancelLongPress}
            >
              <AppIconVisual item={item} name={name} isDockItem={isDockItem} />
            </motion.button>
          </Link>
        </div>
      );
    }

    return (
      <div
        key={item.id}
        ref={(el: HTMLDivElement | null) => { itemRefs.current[item.id] = el; }}
        className={`flex items-center justify-center ${isDockItem ? 'w-[64px] h-[64px]' : 'pt-2 flex-col w-[90px]'
          } ${isDragging ? 'relative z-50' : 'relative z-1'}`}
      >
        <div className={isDragging ? undefined : 'animate-jiggle'} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <motion.div
            layoutId={item.id}
            layout
            transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }}
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
            style={{
              touchAction: 'none',
              position: 'relative',
              zIndex: isDragging ? 50 : 1,
              width: isDockItem ? 64 : undefined,
              height: isDockItem ? 64 : undefined,
            }}
            onDragStart={() => {
              setDraggedId(item.id);
              lastTargetRef.current = null;
              insertCooldownRef.current = false;
            }}
            onDrag={(e) => handleDragMove(e, item.id)}
            onDragEnd={() => setDraggedId(null)}
          >
            <AppIconVisual item={item} name={name} isDockItem={isDockItem} />
          </motion.div>
        </div>

        {/* × button */}
        {removable && (
          <motion.button
            key={`del-${item.id}`}
            className={`absolute z-30 w-5 h-5 rounded-full bg-neutral-800/90 border border-white/20 flex items-center justify-center shadow-md ${isDockItem ? 'top-[-6px] left-[-6px]' : 'top-1 left-1'}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isDragging ? 0 : 1, opacity: isDragging ? 0 : 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
            onClick={(e) => handleDelete(e, item.id)}
            onTouchEnd={(e) => handleDelete(e, item.id)}
          >
            <Minus size={12} strokeWidth={3.5} className="text-white" />
          </motion.button>
        )}
      </div>
    );
  };

  return (
    <AppWrapper>
      <LayoutGroup>
        <div className="pt-[80px] px-[16px] relative h-full flex flex-col">
          {/* GRID */}
          {!jiggling ? (
            <div
              className="grid grid-cols-4 w-full content-start flex-1"
              onMouseDown={startLongPress}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              onTouchStart={startLongPress}
              onTouchEnd={cancelLongPress}
              onTouchCancel={cancelLongPress}
            >
              {orderedGrid.map((item) => renderItemContent(item, false))}
            </div>
          ) : (
            <div className="grid grid-cols-4 w-full content-start flex-1">
              {orderedGrid.map((item) => renderItemContent(item, false))}
            </div>
          )}

          {/* DOCK */}
          <div className="mt-auto w-full pb-[24px]">
            <div className="relative h-[88px] w-full px-2">
              {/* Background Blur layer separated from the items wrapper to prevent drag matrix corruption */}
              <div className="absolute inset-0 rounded-[32px] backdrop-blur-sm backdrop-saturate-[200%] bg-white/30 dark:bg-black/30 border border-white/10 dark:border-white/5 pointer-events-none" />
              <div className="relative h-full w-full grid grid-cols-4 items-center justify-items-center">
                {orderedDock.map((item) => renderItemContent(item, true))}
              </div>
            </div>
          </div>

          {/* Concluir Button */}
          {jiggling && (
            <motion.button
              className="absolute top-14 right-4 z-30 text-[12px] font-semibold text-blue-400 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={exitJiggle}
            >
              Concluir
            </motion.button>
          )}
        </div>
      </LayoutGroup>
    </AppWrapper>
  );
};
