export interface CacheService {
    getByKey<T = object>(key: string): Promise<T | null>
    setByKey<T = object>(key: string, value: T, ttlSeconds: number): Promise<void>
    deleteByKey(key: string): Promise<void>
}
