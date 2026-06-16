export type CacheService = {
    getByKey<T>(key: string): Promise<T | null>
    setByKey<T>(key: string, value: T, ttlSeconds: number): Promise<void>
    deleteByKey(key: string): Promise<void>
}
