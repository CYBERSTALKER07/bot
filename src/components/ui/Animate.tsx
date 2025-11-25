import React from 'react';
import { motion, AnimatePresence, HTMLMotionProps, Transition } from 'framer-motion';
import { cn } from '../../lib/cva';

interface AnimateProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "exit"> {
    children: React.ReactNode;
    className?: string;
    initial?: any;
    enter?: any;
    exit?: any;
    isVisible?: boolean; // Optional prop to control AnimatePresence internally if needed, though usually children conditional rendering is used
}

export const Animate: React.FC<AnimateProps> = ({
    children,
    className,
    initial,
    enter,
    exit,
    isVisible = true,
    ...props
}) => {
    // Helper to separate transition props from style props
    const getTransition = (props: any): Transition => {
        if (!props) return {};
        const { duration, delay, ease, type, stiffness, damping, mass, ...rest } = props;
        const transition: any = {};
        if (duration !== undefined) transition.duration = duration / 1000; // Assuming ms if > 10? Or user passes seconds? User snippet: duration: 800. Likely ms.
        // Framer motion uses seconds. If user passes 800, it's likely ms.
        // Let's check if duration is > 10, assume ms.
        if (duration !== undefined) transition.duration = duration > 10 ? duration / 1000 : duration;

        if (delay !== undefined) transition.delay = delay > 10 ? delay / 1000 : delay;
        if (ease) transition.ease = ease;
        if (type) transition.type = type;
        if (stiffness) transition.stiffness = stiffness;
        if (damping) transition.damping = damping;
        if (mass) transition.mass = mass;
        return transition;
    };

    const getStyle = (props: any) => {
        if (!props) return {};
        const { duration, delay, ease, type, stiffness, damping, mass, blur, ...rest } = props;
        const style = { ...rest };
        if (blur !== undefined) style.filter = `blur(${blur}px)`;
        return style;
    };

    const initialStyle = getStyle(initial);
    const animateStyle = getStyle(enter);
    const exitStyle = getStyle(exit);

    const enterTransition = getTransition(enter);
    const exitTransition = getTransition(exit);

    // Combine transitions if needed, or just use one. 
    // Framer motion allows transition prop on the element.

    return (
        <AnimatePresence mode="wait">
            {React.Children.map(children, (child) => {
                if (!child) return null;
                return (
                    <motion.div
                        className={cn(className)}
                        initial={initial ? initialStyle : { opacity: 0, scale: 0.9 }} // Default initial if not provided? Or just undefined.
                        animate={{
                            ...animateStyle,
                            transition: enterTransition
                        }}
                        exit={{
                            ...exitStyle,
                            transition: exitTransition
                        }}
                        {...props}
                    >
                        {child}
                    </motion.div>
                );
            })}
        </AnimatePresence>
    );
};

export default Animate;
