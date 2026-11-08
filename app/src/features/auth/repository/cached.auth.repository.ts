import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { CacheKeys, CacheTtlsSec } from "@global-shared/config/cache.config.js";
import type { User } from "@global-shared/infra/db/generated.prisma/client.js";
import type { AuthRepository, CreateUserInput } from "./auth.repository.js";

export class CachedAuthRepository implements AuthRepository {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtlsSec: CacheTtlsSec
    ) { }

    async getByEmail(emailAddress: string): Promise<User> {
        const dbUser: User = await this.authRepository.getByEmail(emailAddress)
        await this.cacheService.setByKey<User>(
            this.cacheKeys.user.byId(dbUser.id),
            dbUser,
            this.cacheTtlsSec.user
        )
        return dbUser
    }

    async getByUserName(userName: string): Promise<User> {
        const dbUser: User = await this.authRepository.getByUserName(userName)
        await this.cacheService.setByKey<User>(
            this.cacheKeys.user.byId(dbUser.id),
            dbUser,
            this.cacheTtlsSec.user
        )
        return dbUser
    }

    async createUser(input: CreateUserInput): Promise<User> {
        return await this.authRepository.createUser(input)
    }
}