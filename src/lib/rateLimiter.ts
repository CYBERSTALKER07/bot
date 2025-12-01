/**
 * Enterprise-level Rate Limiter
 * Prevents API abuse with per-user and per-tier limits
 */

interface RateLimit {
    count: number;
    resetAt: number;
    tier: UserTier;
}

type UserTier = 'free' | 'premium' | 'admin';

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    retryAfter?: number;
}

class RateLimiter {
    private limits = new Map<string, RateLimit>();

    // Tier-based limits (requests per minute)
    private readonly TIER_LIMITS = {
        free: { requests: 100, window: 60000 },      // 100 requests/min
        premium: { requests: 500, window: 60000 },   // 500 requests/min
        admin: { requests: 10000, window: 60000 }    // 10k requests/min
    };

    /**
     * Check if a user can make a request
     * @param userId - User ID to check
     * @param tier - User's subscription tier
     * @returns Rate limit result with allowed status and remaining requests
     */
    check(userId: string, tier: UserTier = 'free'): RateLimitResult {
        const now = Date.now();
        const limit = this.limits.get(userId);
        const tierLimit = this.TIER_LIMITS[tier];

        // No existing limit or window expired - create new limit
        if (!limit || now > limit.resetAt) {
            const newLimit: RateLimit = {
                count: 1,
                resetAt: now + tierLimit.window,
                tier
            };
            this.limits.set(userId, newLimit);

            return {
                allowed: true,
                remaining: tierLimit.requests - 1,
                resetAt: newLimit.resetAt
            };
        }

        // Rate limit exceeded
        if (limit.count >= tierLimit.requests) {
            const retryAfter = Math.ceil((limit.resetAt - now) / 1000);

            console.warn(`⚠️ Rate limit exceeded for user ${userId} (${tier}). Retry after ${retryAfter}s`);

            return {
                allowed: false,
                remaining: 0,
                resetAt: limit.resetAt,
                retryAfter
            };
        }

        // Increment count and allow request
        limit.count++;

        return {
            allowed: true,
            remaining: tierLimit.requests - limit.count,
            resetAt: limit.resetAt
        };
    }

    /**
     * Reset rate limit for a specific user
     * Useful for testing or manual overrides
     */
    reset(userId: string): void {
        this.limits.delete(userId);
        console.log(`🔄 Rate limit reset for user ${userId}`);
    }

    /**
     * Get current rate limit status for a user
     */
    getStatus(userId: string): RateLimitResult | null {
        const limit = this.limits.get(userId);
        if (!limit) return null;

        const now = Date.now();
        if (now > limit.resetAt) {
            this.limits.delete(userId);
            return null;
        }

        const tierLimit = this.TIER_LIMITS[limit.tier];

        return {
            allowed: limit.count < tierLimit.requests,
            remaining: Math.max(0, tierLimit.requests - limit.count),
            resetAt: limit.resetAt,
            retryAfter: limit.count >= tierLimit.requests
                ? Math.ceil((limit.resetAt - now) / 1000)
                : undefined
        };
    }

    /**
     * Clean up expired limits (run periodically)
     */
    cleanup(): void {
        const now = Date.now();
        let cleaned = 0;

        for (const [userId, limit] of this.limits.entries()) {
            if (now > limit.resetAt) {
                this.limits.delete(userId);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`🧹 Cleaned up ${cleaned} expired rate limits`);
        }
    }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Clean up expired limits every 5 minutes
if (typeof window !== 'undefined') {
    setInterval(() => {
        rateLimiter.cleanup();
    }, 5 * 60 * 1000);
}

/**
 * React hook for rate limiting
 * @example
 * const { checkLimit, status } = useRateLimit(user?.id, user?.subscription_tier);
 * 
 * const handleAction = () => {
 *   if (!checkLimit()) {
 *     toast.error(`Rate limit exceeded. Try again in ${status?.retryAfter}s`);
 *     return;
 *   }
 *   // Proceed with action
 * };
 */
export function useRateLimit(userId: string | undefined, tier: UserTier = 'free') {
    const checkLimit = (): boolean => {
        if (!userId) return true; // Allow if no user (shouldn't happen)

        const result = rateLimiter.check(userId, tier);
        return result.allowed;
    };

    const getStatus = () => {
        if (!userId) return null;
        return rateLimiter.getStatus(userId);
    };

    return {
        checkLimit,
        status: getStatus(),
        reset: () => userId && rateLimiter.reset(userId)
    };
}
