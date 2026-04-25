import { LRUCache } from "lru-cache";

interface RateLimitOptions {
  uniqueTokenPerInterval?: number;
  interval?: number;
}

export default function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // 1 minute par défaut
  });

  return {
    check: (token: string, limit: number) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1]);
        } else {
          tokenCount[0] += 1;
          tokenCache.set(token, tokenCount);
        }

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        if (isRateLimited) {
          reject(new Error("Rate limit exceeded"));
        } else {
          resolve();
        }
      }),
  };
}

// Rate limiters spécifiques par endpoint
export const contactRateLimit = rateLimit({
  uniqueTokenPerInterval: 100,
  interval: 60000, // 1 minute
});

export const newsletterRateLimit = rateLimit({
  uniqueTokenPerInterval: 100,
  interval: 60000,
});

export const quoteRateLimit = rateLimit({
  uniqueTokenPerInterval: 50,
  interval: 60000,
});

export const bookingRateLimit = rateLimit({
  uniqueTokenPerInterval: 50,
  interval: 60000,
});

export const uploadRateLimit = rateLimit({
  uniqueTokenPerInterval: 20,
  interval: 60000,
});

export const authRateLimit = rateLimit({
  uniqueTokenPerInterval: 10,
  interval: 300000, // 5 minutes pour auth
});
