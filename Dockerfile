# build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# ARG para receber valor no build; DATABASE_URL fictícia só para o prisma generate
ARG DATABASE_URL=postgresql://fake:fake@localhost:5432/fake
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
RUN npm run build

# runtime
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/src/shared/infra/database/prisma ./src/shared/infra/database/prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
ENV NODE_ENV=production
EXPOSE 3333
CMD ["node", "dist/shared/infra/http/server.js"]