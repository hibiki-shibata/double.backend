import type { User } from "@global-shared/infra/db/generated.prisma/client.js";
import type { CacheKeys, CacheTtls } from "@global-shared/config/cache.config.js";
import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { CreateUserInput, UpdateUserInput, UserRepository } from "./user.repository.js";

export class CachedUserRepository implements UserRepository {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtls: CacheTtls
    ) { }

    async getById(userId: string): Promise<User> {
        const cachedUser: User | null = await this.cacheService.getByKey<User>(this.cacheKeys.userById(userId))
        if (cachedUser !== null) return cachedUser
        const dbUser: User = await this.userRepository.getById(userId)
        await this.cacheService.setByKey<User>(
            this.cacheKeys.userById(dbUser.id),
            dbUser,
            this.cacheTtls.userTtlSecs
        )
        return dbUser
    }

    async getByEmail(emailAddress: string): Promise<User> {
        const dbUser: User = await this.userRepository.getByEmail(emailAddress)
        await this.cacheService.setByKey<User>(
            this.cacheKeys.userById(dbUser.id),
            dbUser,
            this.cacheTtls.userTtlSecs
        )
        return dbUser
    }

    async getByUserName(userName: string): Promise<User> {
        const dbUser: User = await this.userRepository.getByUserName(userName)
        await this.cacheService.setByKey<User>(
            this.cacheKeys.userById(dbUser.id),
            dbUser,
            this.cacheTtls.userTtlSecs
        )
        return dbUser
    }

    async createUser(input: CreateUserInput): Promise<User> {
        return await this.userRepository.createUser(input)
    }

    async updateUserById(userId: string, input: UpdateUserInput): Promise<User> {
        const dbUser: User = await this.userRepository.updateUserById(userId, input)
        await this.cacheService.deleteByKey(
            this.cacheKeys.userById(dbUser.id)
        )
        return dbUser
    }

    async softDeleteById(userId: string): Promise<User> {
        const dbUser: User = await this.userRepository.softDeleteById(userId)
        await this.cacheService.deleteByKey(
            this.cacheKeys.userById(dbUser.id)
        )
        return dbUser
    }
}