export interface CacheService {
    getByKey<T = unknown>(key: string): Promise<T | null>
    setByKey<T = unknown>(key: string, value: T, ttlSeconds: number): Promise<void>
    deleteByKey(key: string): Promise<void>
}
