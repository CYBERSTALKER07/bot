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
import React, { Children, cloneElement, useEffect, useRef, useState } from 'react';
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
    panelWidth?: number; // Changed from panelHeight
    baseItemSize?: number;
    magnification?: number;
    spring?: SpringOptions;
};

type DockItemProps = {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    mouseY: MotionValue<number>; // Changed from mouseX
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
    mouseY, // Changed from mouseX
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
            height: baseItemSize // Changed from width
        };
        return val - rect.y - baseItemSize / 2; // Changed from rect.x
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
                "relative inline-flex items-center justify-center rounded-full shadow-md transition-colors duration-200",
                "border border-gray-900", // Fixed border color
                isActive
                    ? "bg-white text-black shadow-lg shadow-white/50"
                    : "bg-black text-white hover:bg-gray-900", // Active white with glow, default black with hover
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
                    initial={{ opacity: 0, x: 10 }} // Changed y to x for side tooltip
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        "absolute left-full ml-3 w-fit whitespace-pre rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs text-black shadow-sm",
                        "dark:border-neutral-800 dark:bg-black dark:text-white",
                        className
                    )}
                    role="tooltip"
                    style={{ top: '50%', y: '-50%' }} // Center vertically relative to item
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

export default function Dock({
    items,
    className = '',
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 70,
    distance = 200,
    panelWidth = 68, // Changed from panelHeight
    baseItemSize = 50
}: DockProps) {
    const mouseY = useMotionValue(Infinity); // Changed from mouseX
    const isHovered = useMotionValue(0);

    // For vertical dock, we might want to animate width if we were creating a panel that expands, 
    // but the request is "no borders", so maybe just a column of icons.
    // The original code animated `height` of the container. 
    // Here we'll animate `width` of the container if we want that effect, or just let the items expand.
    // Let's keep the container width logic to accommodate the expanding items.

    // Removed width animation as requested

    return (
        <motion.div
            className="h-full  flex flex-col items-center justify-center py-4 "
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
                    "flex flex-col items-center gap-4 rounded-full pb-2 px-2 border-none bg-transparent border-[rgba(255,255,255,0.5)] shadow-[0_0_70px_0_rgba(0,0,0,0.5)] shadow-white/50",
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
