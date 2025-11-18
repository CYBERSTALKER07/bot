'use client';

import {
    motion,
    MotionValue,
    useMotionValue,
    useSpring,
    useTransform,
    type SpringOptions,
    AnimatePresence
} from 'framer-motion';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../lib/cva';

export type DockItemData = {
    icon: React.ReactNode;
    label: React.ReactNode;
    onClick: () => void;
    className?: string;
    isActive?: boolean;
};

export type DockProps = {
    items: DockItemData[];
    className?: string;
    distance?: number;
    panelWidth?: number;
    baseItemSize?: number;
    dockWidth?: number;
    magnification?: number;
    spring?: SpringOptions;
};

type DockItemProps = {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    mouseY: MotionValue<number>;
    spring: SpringOptions;
    distance: number;
    baseItemSize: number;
    magnification: number;
    isActive?: boolean;
};

function DockItem({
    children,
    className = '',
    onClick,
    mouseY,
    spring,
    distance,
    magnification,
    baseItemSize,
    isActive
}: DockItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseY, val => {
        const rect = ref.current?.getBoundingClientRect() ?? {
            y: 0,
            height: baseItemSize
        };
        return val - rect.y - baseItemSize / 2;
    });

    const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
    const size = useSpring(targetSize, spring);

    return (
        <motion.div
            ref={ref}
            style={{
                width: size,
                height: size
            }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={onClick}
            className={cn(
                "relative inline-flex items-center justify-center rounded-full transition-colors duration-200",
                "bg-transparent", // No background by default or minimal
                isActive ? "text-black bg-white" : "text-white/70 hover:text-white",
                className
            )}
            tabIndex={0}
            role="button"
            aria-haspopup="true"
        >
            {Children.map(children, child =>
                React.isValidElement(child)
                    ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
                    : child
            )}
        </motion.div>
    );
}

type DockLabelProps = {
    className?: string;
    children: React.ReactNode;
    isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isHovered) return;
        const unsubscribe = isHovered.on('change', latest => {
            setIsVisible(latest === 1);
        });
        return () => unsubscribe();
    }, [isHovered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 10 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`${className} absolute left-full top-1/2 -translate-y-1/2 ml-2 w-fit whitespace-pre rounded-md border border-neutral-800 bg-black px-2 py-0.5 text-xs text-white z-50`}
                    role="tooltip"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

type DockIconProps = {
    className?: string;
    children: React.ReactNode;
    isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = '' }: DockIconProps) {
    return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function VerticalDock({
    items,
    className = '',
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 70,
    distance = 200,
    panelWidth = 64,
    dockWidth = 256, // Not strictly used for vertical width constraint but kept for API consistency
    baseItemSize = 50
}: DockProps) {
    const mouseY = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);

    // Calculate width based on hover state
    // For vertical dock, we might want the container to expand slightly or just the items
    // Let's keep the container relatively static width but allow items to overflow if needed
    // or animate the container width.
    // The original code animated height. Here we animate width.

    const maxWidth = useMemo(() => Math.max(dockWidth, magnification + magnification / 2 + 4), [magnification, dockWidth]);
    // For a sidebar, we often want a fixed width container where items pop out.
    // But let's try to follow the dock physics.

    // Actually, for a sidebar dock, usually the container stays fixed width (e.g. 80px) 
    // and the magnified items might overflow it visually (z-index).
    // Let's stick to a simple container that doesn't change width too drastically to avoid layout shift of main content,
    // OR we make it absolute/fixed positioned so it doesn't affect layout.

    // The user asked for "navigation sidebar on pc".
    // Usually sidebars push content.
    // If we use the dock physics, the width changes.
    // Let's assume fixed position for the dock itself.

    return (
        <motion.div
            style={{ width: panelWidth, scrollbarWidth: 'none' }}
            className="h-full flex flex-col items-center justify-center"
        >
            <motion.div
                onMouseMove={({ pageY }) => {
                    isHovered.set(1);
                    mouseY.set(pageY);
                }}
                onMouseLeave={() => {
                    isHovered.set(0);
                    mouseY.set(Infinity);
                }}
                className={cn(
                    "flex flex-col items-center gap-4 rounded-2xl py-4 px-2",
                    "bg-black/90 backdrop-blur-xl", // Black background
                    className
                )}
                style={{ width: panelWidth }}
                role="toolbar"
                aria-label="Application dock"
            >
                {items.map((item, index) => (
                    <DockItem
                        key={index}
                        onClick={item.onClick}
                        className={item.className}
                        mouseY={mouseY}
                        spring={spring}
                        distance={distance}
                        magnification={magnification}
                        baseItemSize={baseItemSize}
                        isActive={item.isActive}
                    >
                        <DockIcon>{item.icon}</DockIcon>
                        <DockLabel>{item.label}</DockLabel>
                    </DockItem>
                ))}
            </motion.div>
        </motion.div>
    );
}
