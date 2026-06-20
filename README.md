e## Double 
#### ~ Prediction Market Backend Server ~

[Instagram](https://www.instagram.com/double.app.co/)

- [Service & Tech Stack](https://github.com/hibiki-shibata/double.backend/main/doc/overview.md)
- [System Architecture](https://github.com/hibiki-shibata/double.backend/main/doc/architecture.md)
- [Features & Future plan](https://github.com/hibiki-shibata/double.backend/main/doc/features.md)
- [Challenges](https://github.com/hibiki-shibata/double.backend/main/doc/challenges.md)

### Locally start server
#### 1. Add .env file
```.env
NODE_ENV=< dev | stage | prod>
PORT_NUMBER=<e.g,. 3000>
BCRYPT_SALT_ROUNDS=<10 ~ 15>
RATE_LIMIT=<limit per 15 mins>
LOG_LEVEL=<info | warn | error | debug>
JWT_SECRET_KEY=<31 ~ 50 letters>
REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=
DATABASE_URL="postgresql://[db-username]:[db-password]@[db-hostname]:[db-port-number]/[db-name]?schema=public"
STRIPE_API_KEY
```
### Startup
Make sure the latest Postgres & Redis official image is installed
```sh
pnpm run build
docker compose up -d
or 
pnpm start
```