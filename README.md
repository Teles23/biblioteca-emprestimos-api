# Biblioteca Emprestimos API

Backend modular para gerenciamento de emprestimos de livros, seguindo Clean Architecture, DDD e Monolito Modular.

## Stack

- Node.js
- TypeScript
- Express
- Prisma ORM 7
- PostgreSQL
- JWT
- bcrypt
- Jest

## Variaveis de ambiente

Copie `.env.example` para `.env` e ajuste os valores:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`

## Como executar

1. Instale dependencias:
   ```bash
   npm install
   ```
2. Gere o client do Prisma:
   ```bash
   npm run prisma:generate
   ```
3. Rode as migrations:
   ```bash
   npm run prisma:migrate
   ```
4. Rode em desenvolvimento:
   ```bash
   npm run dev
   ```

## Prisma (Prisma 7)

- O `schema.prisma` mantem somente `provider` no `datasource` (sem `url`).
- A URL do banco para comandos Prisma fica em `prisma.config.ts` via `datasource.url`.
- O `PrismaClient` usa `@prisma/adapter-pg` com `pg` (`Pool`) para conexao direta com PostgreSQL.

## Scripts uteis

- `npm run dev`: sobe a API em modo watch com `tsx`.
- `npm run build`: compila TypeScript para `dist`.
- `npm run start`: executa build em producao.
- `npm run test`: executa testes com Jest.
- `npm run lint`: roda ESLint.
- `npm run prisma:generate`: gera Prisma Client.
- `npm run prisma:migrate`: executa `prisma migrate dev`.

## Estrutura

- `src/modules/*`: modulos de dominio (auth, users, books, authors, categories, loans)
- `src/shared/infra`: infraestrutura compartilhada (HTTP, middleware, banco)
- `src/config`: configuracoes de ambiente
