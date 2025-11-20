import confetti from 'canvas-confetti';

// Success confetti animation
export const triggerSuccessConfetti = () => {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999
    };

    function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};

// Subtle success animation (no confetti, just a small burst)
export const triggerSubtleSuccess = () => {
    confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a3e635', '#84cc16', '#65a30d'], // Lime colors
        zIndex: 9999
    });
};
