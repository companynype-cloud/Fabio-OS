import Redis from 'ioredis'

declare global {
  var redis: Redis | undefined
}

function createRedis() {
  return new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  })
}

export const redis: Redis = globalThis.redis ?? createRedis()

if (process.env.NODE_ENV !== 'production') globalThis.redis = redis

export async function cacheGet<T>(key: string): Promise<T | null> {
  const value = await redis.get(key)
  return value ? (JSON.parse(value) as T) : null
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
}

export async function cacheDel(...keys: string[]): Promise<void> {
  if (keys.length) await redis.del(...keys)
}

export function cacheKey(...parts: string[]): string {
  return parts.join(':')
}
