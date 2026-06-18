import type { User } from "../../../../shared/infra/db/generated.prisma/client.js";
import type { CacheService } from "../../../../shared/infra/cache/service/cache.service.js";
import type { CreateUserInput, UpdateUserInput, UserRepository } from "./user.repository.js";
import type { CacheKeys } from "../../../../shared/config/cache.config.js";

export class CachedUserRepository implements UserRepository {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtlSecs: number = 60 * 10
    ) { }

    async getById(userId: string): Promise<User> {
        const cachedUser: User | null = await this.cacheService.getByKey<User>(this.cacheKeys.userById(userId))
        if (cachedUser !== null) return cachedUser
        const dbUser: User = await this.userRepository.getById(userId)
        await this.cacheService.setByKey<User>(
            this.cacheKeys.userById(dbUser.id),
            dbUser,
            this.cacheTtlSecs
        )
        return dbUser
    }

    async getByEmail(emailAddress: string): Promise<User> {
        const dbUser: User = await this.userRepository.getByEmail(emailAddress)
        await this.cacheService.setByKey<User>(
            this.cacheKeys.userById(dbUser.id),
            dbUser,
            this.cacheTtlSecs
        )
        return dbUser
    }

    async getByUserName(userName: string): Promise<User> {
        const dbUser: User = await this.userRepository.getByUserName(userName)
        await this.cacheService.setByKey<User>(
            this.cacheKeys.userById(dbUser.id),
            dbUser,
            this.cacheTtlSecs
        )
        return dbUser
    }

    async createUser(input: CreateUserInput): Promise<User> {
        return await this.userRepository.createUser(input)
    }

    async updateById(userId: string, input: UpdateUserInput): Promise<User> {
        const dbUser: User = await this.userRepository.updateById(userId, input)
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