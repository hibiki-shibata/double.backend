## Deployment


### DB migration
(Prisma Offical Doc)[https://www.prisma.io/docs/prisma-orm/quickstart/postgresql]
```sh
# Migrate - generate SQL 
pnpm dlx prisma migrate dev --name init
# Reflect migration to the DB
pnpm dlx prisma generate
# Access and verify DB
psql -h localhost -U postgres -d postgres -p 5432
# Force reset db migration
pnpm dlx prisma migrate reset -force
```