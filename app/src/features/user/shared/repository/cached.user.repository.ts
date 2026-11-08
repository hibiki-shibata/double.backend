import type { User } from "@global-shared/infra/db/generated.prisma/client.js";
import type { CacheKeys, CacheTtlsSec } from "@global-shared/config/cache.config.js";
import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { UpdateUserInput, UserRepository } from "./user.repository.js";

export class CachedUserRepository implements UserRepository {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtlsSec: CacheTtlsSec
    ) { }

    async getById(userId: string): Promise<User> {
        const userCacheKey: string = this.cacheKeys.user.byId(userId)
        const cachedUser: User | null = await this.cacheService.getByKey<User>(userCacheKey)
        if (cachedUser !== null) return cachedUser
        const dbUser: User = await this.userRepository.getById(userId)
        await this.cacheService.setByKey<User>(
            userCacheKey,
            dbUser,
            this.cacheTtlsSec.user
        )
        return dbUser
    }

    async updateUserById(userId: string, input: UpdateUserInput): Promise<User> {
        const dbUser: User = await this.userRepository.updateUserById(userId, input)
        await this.cacheService.deleteByKey(
            this.cacheKeys.user.byId(dbUser.id)
        )
        return dbUser
    }

    async softDeleteById(userId: string): Promise<User> {
        const dbUser: User = await this.userRepository.softDeleteById(userId)
        await this.cacheService.deleteByKey(
            this.cacheKeys.user.byId(dbUser.id)
        )
        return dbUser
    }
}