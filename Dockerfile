# FROM ghcr.io/pnpm/pnpm:11 AS dependencies
# RUN pnpm runtime set node 26 -g
# WORKDIR /workdir
# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# RUN pnpm install --frozen-lockfile


FROM ghcr.io/pnpm/pnpm:11 AS builder
RUN pnpm runtime set node 26 -g
WORKDIR /workdir
# Dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Typescript
COPY tsconfig.build.json ./
# Source code
COPY app/src ./app/src
RUN pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm prune --production


FROM node:26-alpine AS runner
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 --ingroup nodejs appuser
WORKDIR /workdir
ENV NODE_ENV=production
COPY --from=builder --chown=appuser:nodejs /workdir/dist         ./dist
COPY --from=builder --chown=appuser:nodejs /workdir/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /workdir/package.json ./package.json
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/index.js"]