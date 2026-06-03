
enum UserStatus {
    active,
    suspended,
    deleted
}

enum UserRoles {
    user,
    admin
}

export type User = {
    id: string
    name: string
    display_name: string
    email_address: string | null
    password_hash: string
    status: UserStatus
    roles: UserRoles[]
    created_at: Date
    updated_at: Date
}