export namespace CacheServiceParams {
    export type Set<T> = {
        key: string,
        value: T,
        ttlSec: number
    }
}

export interface CacheService {
    getByKey<T = object>(key: string): Promise<T | null>
    set<T = object>(dto: CacheServiceParams.Set<T>): Promise<void>
    deleteByKey(key: string): Promise<void>
}
