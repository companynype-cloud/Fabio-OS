import { Queue, Worker, type Processor, type ConnectionOptions } from 'bullmq'

// BullMQ bundles its own ioredis — pass a plain connection options object, not an ioredis instance
function getConnection(): ConnectionOptions {
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
  try {
    const parsed = new URL(url)
    return {
      host: parsed.hostname,
      port: Number(parsed.port) || 6379,
      password: parsed.password || undefined,
      tls: parsed.protocol === 'rediss:' ? {} : undefined,
    }
  } catch {
    return { host: 'localhost', port: 6379 }
  }
}

const connection = getConnection()

export const QUEUES = {
  EMAIL: 'email',
  AI: 'ai',
  NOTIFICATION: 'notification',
  AUTOMATION: 'automation',
} as const

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES]

const queues = new Map<QueueName, Queue>()

export function getQueue(name: QueueName): Queue {
  if (!queues.has(name)) {
    queues.set(name, new Queue(name, { connection }))
  }
  return queues.get(name)!
}

export function createWorker<T>(name: QueueName, processor: Processor<T>) {
  return new Worker<T>(name, processor, { connection })
}

export async function enqueue<T>(
  queue: QueueName,
  jobName: string,
  data: T,
  opts?: { delay?: number; attempts?: number }
) {
  return getQueue(queue).add(jobName, data, {
    attempts: opts?.attempts ?? 3,
    delay: opts?.delay,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  })
}
