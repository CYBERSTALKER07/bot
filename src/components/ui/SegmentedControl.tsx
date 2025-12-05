import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';

interface SegmentedControlProps {
    children: React.ReactNode;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    'aria-label'?: string;
}

interface SegmentedControlOptionProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

// Context to share state with options
const SegmentedControlContext = React.createContext<{
    value: string;
    onChange: (value: string) => void;
} | null>(null);

const SegmentedControlRoot = ({
    children,
    value,
    onChange,
    className,
    'aria-label': ariaLabel,
}: SegmentedControlProps) => {
    const { isDark } = useTheme();

    return (
        <SegmentedControlContext.Provider value={{ value, onChange }}>
            <div
                className={cn(
                    'flex p-1 rounded-lg h-[48px] relative isolate',
                    isDark ? 'bg-gray-900' : 'bg-gray-100',
                    className
                )}
                role="group"
                aria-label={ariaLabel}
            >
                {children}
            </div>
        </SegmentedControlContext.Provider>
    );
};

const SegmentedControlOption = ({
    value,
    children,
    className,
    disabled,
}: SegmentedControlOptionProps) => {
    const context = React.useContext(SegmentedControlContext);
    const { isDark } = useTheme();

    if (!context) {
        throw new Error('SegmentedControl.Option must be used within SegmentedControl');
    }

    const isActive = context.value === value;

    return (
        <button
            type="button"
            onClick={() => !disabled && context.onChange(value)}
            disabled={disabled}
            className={cn(
                'relative flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg z-10',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                isActive
                    ? isDark ? 'text-black' : 'text-black'
                    : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            aria-pressed={isActive}
        >
            {isActive && (
                <motion.div
                    layoutId="segmented-control-active"
                    className={cn(
                        'absolute inset-0 rounded-lg -z-10 shadow-sm',
                        isDark ? 'bg-white' : 'bg-white'
                    )}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30
                    }}
                />
            )}
            {children}
        </button>
    );
};

export const SegmentedControl = Object.assign(SegmentedControlRoot, {
    Option: SegmentedControlOption,
});

export default SegmentedControl;
