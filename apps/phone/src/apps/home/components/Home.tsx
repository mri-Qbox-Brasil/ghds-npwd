import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppWrapper } from '@ui/components';
import { useApps } from '@os/apps/hooks/useApps';
import { useExternalApps } from '@common/hooks/useExternalApps';
import { useAppStore } from '@apps/store/hooks/useAppStore';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { IApp } from '@os/apps/config/apps';

const LONG_PRESS_MS = 600;

/** Renderiza o conteúdo visual de um ícone sem Link (used in jiggle mode) */
const AppIconVisual: React.FC<{ item: IApp; name: string }> = ({ item, name }) => (
  <div className="flex flex-col items-center w-[90px] mb-6">
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
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const baseGridApps = apps?.filter((a) => {
    if (a.isDockApp) return false;
    if (a.isDisabled) return false;
    if (!isLoaded) return true;
    return isInstalled(a.id);
  }) ?? [];

  // Aplica a ordem salva, colocando apps sem posição salva no final
  const sortedApps = [...baseGridApps, ...externalApps].sort((a, b) => {
    const ia = appOrder.indexOf(a.id);
    const ib = appOrder.indexOf(b.id);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  // Estado local para drag; sincroniza da store
  const [orderedApps, setOrderedApps] = useState<IApp[]>(sortedApps);

  // Sincroniza quando a lista base muda (install/uninstall) ou appOrder chega do banco
  const prevKey = [...baseGridApps, ...externalApps].map((a) => a.id).join(',') + '|' + appOrder.join(',');
  const prevKeyRef = useRef('');
  if (prevKeyRef.current !== prevKey) {
    prevKeyRef.current = prevKey;
    setOrderedApps(sortedApps);
  }

  const handleReorder = useCallback(
    (newOrder: IApp[]) => {
      setOrderedApps(newOrder);
      setAppOrder(newOrder.map((a) => a.id));
    },
    [setAppOrder],
  );

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

        {/* === MODO NORMAL: grid com Link para navegação === */}
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
                      className="group p-0 bg-transparent flex flex-col items-center text-center w-[90px] mb-6"
                      whileTap={{ scale: 0.88 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <div
                        className="transition-all duration-200 flex justify-center items-center rounded-[18px] overflow-hidden w-[64px] h-[64px]"
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

        {/* === JIGGLE MODE: Reorder drag & drop === */}
        {jiggling && (
          <>
            <Reorder.Group
              axis="y"
              values={orderedApps}
              onReorder={handleReorder}
              className="grid grid-cols-4 w-full list-none p-0 m-0"
              as="div"
            >
              {orderedApps.map((item) => {
                const name = t(item.nameLocale) as unknown as string;
                const removable = !isEssential(item.id);
                return (
                  <Reorder.Item
                    key={item.id}
                    value={item}
                    as="div"
                    className="flex flex-col items-center pt-2 relative cursor-grab active:cursor-grabbing"
                  >
                    <motion.div
                      className="animate-jiggle"
                      animate={{ rotate: [-1.5, 1.5, -1.5] }}
                      transition={{ duration: 0.25, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <AppIconVisual item={item} name={name} />
                    </motion.div>

                    {/* Botão × de deletar */}
                    <AnimatePresence>
                      {removable && (
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
                          <X size={11} strokeWidth={3} className="text-white" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>

            {/* Botão Concluir */}
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
