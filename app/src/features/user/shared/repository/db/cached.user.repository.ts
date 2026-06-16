import type { User } from "../../../../../shared/infra/db/generated.prisma/client.js";
import type { CacheService } from "../../../../../shared/infra/cache/cache.service.js";
import type { UserCreateDBInput, UserRepository, UserUpdateDBInput } from "../user.repository.js";

export class CachedUserRepository implements UserRepository {
    private cacheKey(userId: string): string {
        return 'user:' + userId
    }

    constructor(
        private readonly dbRepository: UserRepository,
        private readonly cacheService: CacheService,
        private readonly cacheTtl = 60 * 10
    ) { }

    async getUserById(userId: string): Promise<User> {
        const cachedUser: User | null = await this.cacheService.getByKey<User>(this.cacheKey(userId))
        if (cachedUser !== null) return cachedUser
        return await this.dbRepository.getUserById(userId)
    }

    async getUserByEmail(emailAddress: string): Promise<User> {
        const user: User = await this.dbRepository.getUserByEmail(emailAddress)
        this.cacheService.setByKey(this.cacheKey(user.id), user, this.cacheTtl)
        return user
    }

    async getUserByUserName(userName: string): Promise<User> {
        const user: User = await this.dbRepository.getUserByUserName(userName)
        this.cacheService.setByKey(this.cacheKey(user.id), user, this.cacheTtl)
        return user
    }

    async createUser(input: UserCreateDBInput): Promise<User> {
        const user: User = await this.dbRepository.createUser(input)
        this.cacheService.setByKey(this.cacheKey(user.id), user, this.cacheTtl)
        return user
    }

    async updateUserById(userId: string, input: UserUpdateDBInput): Promise<User> {
        const user: User = await this.dbRepository.updateUserById(userId, input)
        this.cacheService.setByKey(this.cacheKey(user.id), user, this.cacheTtl)
        return user
    }

    async softDeleteUserById(userId: string): Promise<User> {
        const user: User = await this.dbRepository.softDeleteUserById(userId)
        this.cacheService.deleteByKey(user.id)
        return user
    }
}