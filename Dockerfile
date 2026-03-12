FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG DATABASE_URL
ARG DIRECT_URL

RUN npx prisma generate
RUN npm run build

EXPOSE 3333

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
