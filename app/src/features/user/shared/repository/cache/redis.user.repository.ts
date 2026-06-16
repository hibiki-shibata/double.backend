// import type { RedisCacheService } from "../../../../../shared/infra/cache/redis.service.js"
// import type { User } from "../../../../../shared/infra/db/generated.prisma/client.js"
import type { UserRepository } from "../user.repository.js"


// export class RedisUserRepository implements UserRepository {
//     private readonly CacheKeys = {
//         user: (userId: string) => `user:${userId}`,
//         userEmail: (email: string) => `user:email:${email}`,
//         userSession: (userId: string) => `user:${userId}:session`,
//     }

//     constructor(
//         private readonly redis: RedisCacheService,
//         private readonly key: string = 'user:'
//     ) { }

//     async getUserById(userId: string): Promise<User | null> {
//         const cachedUser: User | null = await this.cache.getByKey<User>('user:id:' + userId)
//         if (cachedUser !== null) return cachedUser
//         return null
//     }

//     getUserByEmail(emailAddress: string): Promise<User> {
//         const cachedUser:
//             return
//     }
//     getUserByUserName(userName: string): Promise<User> {
//         return
//     }
//     createUser(user: UserCreateDBInput): Promise<User> {
//         return
//     }
//     updateUserById(userId: string, data: UserUpdateDBInput): Promise<User> {
//         return
//     }
//     softDeleteUserById(userId: string): Promise<void> {
//         return
//     }
// }