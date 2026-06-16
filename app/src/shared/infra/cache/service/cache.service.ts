export type CacheService = {
    getByKey<T>(key: string): Promise<T | null>
    setByKey(key: string, value: unknown, ttlSeconds: number): Promise<void>
    deleteByKey(key: string): Promise<void>
}
