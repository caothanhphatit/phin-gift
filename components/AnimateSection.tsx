'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface AnimateSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function AnimateSection({
    children,
    className = '',
    delay = 0,
    direction = 'up',
}: AnimateSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const directionVariants = {
        up: { y: 40, opacity: 0 },
        down: { y: -40, opacity: 0 },
        left: { x: -40, opacity: 0 },
        right: { x: 40, opacity: 0 },
        none: { opacity: 0 },
    };

    return (
        <motion.div
            ref={ref}
            initial={directionVariants[direction]}
            animate={isInView ? { x: 0, y: 0, opacity: 1 } : directionVariants[direction]}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
