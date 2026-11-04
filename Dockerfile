# Multi-stage Dockerfile for NestJS API (@riau-gis/api)
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

# Copy root & package manifests for clean layer caching
COPY package*.json turbo.json ./
COPY packages/types/package*.json ./packages/types/
COPY apps/api/package*.json ./apps/api/

# Install monorepo dependencies
RUN npm install

# Copy source code
COPY packages/types ./packages/types
COPY apps/api ./apps/api

# Generate Prisma client and build API
RUN npm run db:generate
RUN npm run build:api

# Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN apk add --no-cache openssl

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/types ./packages/types
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

EXPOSE 4000

CMD ["node", "apps/api/dist/main.js"]
