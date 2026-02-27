import React from 'react';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';

interface SwipeBackProps {
    children: React.ReactNode;
    /** className passado para o motion.div externo */
    className?: string;
}

const SWIPE_THRESHOLD = 60; // px nécessários para ativar o swipe back

/**
 * Envolve qualquer tela e habilita o gesto de swipe-back (arrastar da esquerda para a direita).
 * Ao arrastar mais que SWIPE_THRESHOLD px para a direita, navega para trás no histórico.
 */
export const SwipeBack: React.FC<SwipeBackProps> = ({ children, className }) => {
    const history = useHistory();

    return (
        <motion.div
            className={className ?? 'flex flex-col w-full h-full'}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.25 }}
            dragSnapToOrigin
            onDragEnd={(_e, info) => {
                if (info.offset.x > SWIPE_THRESHOLD && info.velocity.x > 0) {
                    history.goBack();
                }
            }}
        >
            {children}
        </motion.div>
    );
};
