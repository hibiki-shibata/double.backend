import type { User } from "../../../../shared/infra/db/generated.prisma/client.js";
import type { CacheService } from "../../../../shared/infra/cache/service/cache.service.js";
import type { UserCreateDBInput, UserRepository, UserUpdateDBInput } from "./user.repository.js";
import type { CacheKeys } from "../../../../shared/config/cache.config.js";

export class CachedUserRepository implements UserRepository {

    constructor(
        private readonly dbRepository: UserRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtl: number = 60 * 10
    ) { }

    async getUserById(userId: string): Promise<User> {
        const cachedUser: User | null = await this.cacheService.getByKey<User>(this.cacheKeys.userById(userId))
        if (cachedUser !== null) return cachedUser
        return await this.dbRepository.getUserById(userId)
    }

    async getUserByEmail(emailAddress: string): Promise<User> {
        const user: User = await this.dbRepository.getUserByEmail(emailAddress)
        this.cacheService.setByKey(this.cacheKeys.userById(user.id), user, this.cacheTtl)
        return user
    }

    async getUserByUserName(userName: string): Promise<User> {
        const user: User = await this.dbRepository.getUserByUserName(userName)
        this.cacheService.setByKey(this.cacheKeys.userById(user.id), user, this.cacheTtl)
        return user
    }

    async createUser(input: UserCreateDBInput): Promise<User> {
        const user: User = await this.dbRepository.createUser(input)
        this.cacheService.setByKey(this.cacheKeys.userById(user.id), user, this.cacheTtl)
        return user
    }

    async updateUserById(userId: string, input: UserUpdateDBInput): Promise<User> {
        const user: User = await this.dbRepository.updateUserById(userId, input)
        this.cacheService.setByKey(this.cacheKeys.userById(user.id), user, this.cacheTtl)
        return user
    }

    async softDeleteUserById(userId: string): Promise<User> {
        const user: User = await this.dbRepository.softDeleteUserById(userId)
        this.cacheService.deleteByKey(user.id)
        return user
    }
}