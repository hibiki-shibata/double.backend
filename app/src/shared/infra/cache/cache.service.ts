export type CacheService = {
    getByKey(key: string): Promise<unknown | null>
    setByKey(key: string, value: unknown, ttlSeconds?: number): Promise<void>
    deleteByKey(key: string): Promise<void>
}
