import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppIcon } from '@ui/components';
import { useJiggling } from '../state';
import { useTranslation } from 'react-i18next';

interface DockProps {
    apps: any[];
}

export const Dock: React.FC<DockProps> = ({ apps: initialApps }) => {
    const [jiggling] = useJiggling();
    const [t] = useTranslation();
    const [orderedApps, setOrderedApps] = useState(initialApps);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const lastTargetRef = useRef<string | null>(null);
    const cooldownRef = useRef(false);
    const orderedAppsRef = useRef(orderedApps);
    orderedAppsRef.current = orderedApps;

    // Sync when apps prop changes (initial load)
    const prevKeyRef = useRef('');
    const currKey = initialApps.map((a) => a.id).join(',');
    if (prevKeyRef.current !== currKey) {
        prevKeyRef.current = currKey;
        setOrderedApps(initialApps);
    }

    const findTarget = useCallback((x: number, y: number, excludeId: string): string | null => {
        for (const [id, el] of Object.entries(itemRefs.current)) {
            if (id === excludeId || !el) continue;
            const r = el.getBoundingClientRect();
            if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return id;
        }
        return null;
    }, []);

    const insertItem = useCallback((fromId: string, toId: string) => {
        const curr = orderedAppsRef.current;
        const fi = curr.findIndex((a) => a.id === fromId);
        const ti = curr.findIndex((a) => a.id === toId);
        if (fi === -1 || ti === -1 || fi === ti) return;
        const next = [...curr];
        const [removed] = next.splice(fi, 1);
        next.splice(ti, 0, removed);
        setOrderedApps(next);
    }, []);

    const handleDrag = useCallback((e: any, id: string) => {
        if (cooldownRef.current) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        const targetId = findTarget(x, y, id);
        if (!targetId || targetId === lastTargetRef.current) return;
        lastTargetRef.current = targetId;
        cooldownRef.current = true;
        setTimeout(() => {
            cooldownRef.current = false;
            lastTargetRef.current = null;
        }, 140);
        insertItem(id, targetId);
    }, [findTarget, insertItem]);

    if (!initialApps || initialApps.length === 0) return null;

    return (
        <div style={{ position: 'absolute', bottom: '24px', left: '16px', right: '16px' }}>
            <div className="h-[88px] w-full rounded-[32px] backdrop-blur-sm backdrop-saturate-[200%] bg-white/30 dark:bg-black/30 border border-white/10 dark:border-white/5 flex items-center justify-evenly px-2">
                {jiggling ? (
                    /* ── Jiggle mode: draggable icons ── */
                    orderedApps.map((app) => {
                        const isDragging = draggedId === app.id;
                        return (
                            <motion.div
                                key={app.id}
                                ref={(el: HTMLDivElement | null) => { itemRefs.current[app.id] = el; }}
                                layout={!isDragging}
                                transition={{ type: 'tween', duration: 0.13, ease: 'easeOut' }}
                                className="relative flex items-center justify-center"
                            >
                                <div className={isDragging ? undefined : 'animate-jiggle'}>
                                    <motion.div
                                        drag
                                        dragSnapToOrigin
                                        dragElastic={0.15}
                                        dragMomentum={false}
                                        whileDrag={{
                                            scale: 1.25,
                                            zIndex: 50,
                                            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.45))',
                                        }}
                                        style={{ touchAction: 'none', position: 'relative', zIndex: isDragging ? 50 : 1 }}
                                        onDragStart={() => {
                                            setDraggedId(app.id);
                                            lastTargetRef.current = null;
                                            cooldownRef.current = false;
                                        }}
                                        onDrag={(e) => handleDrag(e, app.id)}
                                        onDragEnd={() => setDraggedId(null)}
                                    >
                                        <AppIcon {...app} isDockItem={true} />
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    /* ── Normal mode: links ── */
                    orderedApps.map((app) => (
                        <Link key={app.id} to={app.path} style={{ textDecoration: 'none' }}>
                            <AppIcon {...app} isDockItem={true} />
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};
