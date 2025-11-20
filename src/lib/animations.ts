import type { Variants } from 'framer-motion';

// Modal animations
export const modalVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring',
            damping: 25,
            stiffness: 300
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
            duration: 0.2
        }
    }
};

// Mobile bottom sheet
export const bottomSheetVariants: Variants = {
    hidden: {
        y: '100%',
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            damping: 30,
            stiffness: 300
        }
    },
    exit: {
        y: '100%',
        opacity: 0,
        transition: {
            duration: 0.3
        }
    }
};

// Backdrop fade
export const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

// Success checkmark animation
export const successVariants: Variants = {
    hidden: {
        scale: 0,
        opacity: 0
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring',
            damping: 15,
            stiffness: 300,
            delay: 0.1
        }
    }
};

// Shake animation for errors
export const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
};

// Fade in from bottom
export const fadeInUpVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3
        }
    }
};

// Stagger children animation
export const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

// Button hover/tap animations
export const buttonVariants: Variants = {
    rest: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.2
        }
    },
    tap: {
        scale: 0.98,
        transition: {
            duration: 0.1
        }
    }
};

// Progress bar animation
export const progressBarVariants: Variants = {
    initial: { scaleX: 0, originX: 0 },
    animate: {
        scaleX: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut'
        }
    }
};
