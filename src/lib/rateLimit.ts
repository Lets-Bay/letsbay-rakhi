// Simple in-memory rate limiter for MVP
// In production, use Redis or a proper rate limiter

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const limiterMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of limiterMap.entries()) {
        if (now > entry.resetTime) {
            limiterMap.delete(key);
        }
    }
}, 5 * 60 * 1000);

export function rateLimit(
    key: string,
    maxRequests: number = 10,
    windowMs: number = 60 * 60 * 1000 // 1 hour
): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const entry = limiterMap.get(key);

    if (!entry || now > entry.resetTime) {
        limiterMap.set(key, { count: 1, resetTime: now + windowMs });
        return { allowed: true, remaining: maxRequests - 1 };
    }

    if (entry.count >= maxRequests) {
        return { allowed: false, remaining: 0 };
    }

    entry.count++;
    return { allowed: true, remaining: maxRequests - entry.count };
}
