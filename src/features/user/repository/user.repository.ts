import { type User, UserStatus, UserRoles } from '../../../shared/infra/db/generated.prisma/client.js'
import { prisma } from '../../../shared/infra/db/postgresClient.js'

const userStatus = UserStatus.active
const userRole = [UserRoles.admin, UserRoles.user]

const exampleUser: User = {
    name: 'string;',
    id: 'string',
    display_name: 'string',
    email_address: 'string',
    password_hash: 'string',
    status: userStatus,
    roles: userRole,
    created_at: new Date("2022-03-25"),
    updated_at: new Date("2022-03-25")
}


async function main() {
    // Create a new user with a post
    const user = await prisma.user.create({
        data: exampleUser,
        include: {
            wallets: true,
        },
    });
    console.log("Created user:", user);

    // Fetch all users with their posts
    const allUsers = await prisma.user.findMany({
        include: {
            wallets: true,
        },
    });
    console.log("All users:", JSON.stringify(allUsers, null, 2));
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });