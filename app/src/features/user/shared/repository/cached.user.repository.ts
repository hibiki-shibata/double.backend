import type { User } from "../../../../shared/infra/db/generated.prisma/client.js";
import type { CacheService } from "../../../../shared/infra/cache/service/cache.service.js";
import type { UserCreateDBInput, UserRepository, UserUpdateDBInput } from "./user.repository.js";
import type { CacheKeys } from "../../../../shared/config/cache.config.js";

export class CachedUserRepository implements UserRepository {
    constructor(
        private readonly dbRepository: UserRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtlSecs: number = 60 * 10
    ) { }

    async getUserById(userId: string): Promise<User> {
        const cachedUser: User | null = await this.cacheService.getByKey<User>(this.cacheKeys.userById(userId))
        if (cachedUser === null) {
            const dbUser: User = await this.dbRepository.getUserById(userId)
            await this.cacheService.setByKey<User>(
                this.cacheKeys.userById(dbUser.id),
                dbUser,
                this.cacheTtlSecs
            )
            return dbUser
        }
        return cachedUser
    }

    async getUserByEmail(emailAddress: string): Promise<User> {
        const dbUser: User = await this.dbRepository.getUserByEmail(emailAddress)
        await this.cacheService.setByKey<User>(
            this.cacheKeys.userById(dbUser.id),
            dbUser,
            this.cacheTtlSecs
        )
        return dbUser
    }

    async getUserByUserName(userName: string): Promise<User> {
        const dbUser: User = await this.dbRepository.getUserByUserName(userName)
        await this.cacheService.setByKey<User>(
            this.cacheKeys.userById(dbUser.id),
            dbUser,
            this.cacheTtlSecs
        )
        return dbUser
    }

    async createUser(input: UserCreateDBInput): Promise<User> {
        return await this.dbRepository.createUser(input)
    }

    async updateUserById(userId: string, input: UserUpdateDBInput): Promise<User> {
        const dbUser: User = await this.dbRepository.updateUserById(userId, input)
        await this.cacheService.deleteByKey(
            this.cacheKeys.userById(dbUser.id)
        )
        return dbUser
    }

    async softDeleteUserById(userId: string): Promise<User> {
        const dbUser: User = await this.dbRepository.softDeleteUserById(userId)
        await this.cacheService.deleteByKey(
            this.cacheKeys.userById(dbUser.id)
        )
        return dbUser
    }
}