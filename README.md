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
4. Popule dados iniciais (admin + dados demo):
   ```bash
   npm run prisma:seed
   ```
5. Rode em desenvolvimento:
   ```bash
   npm run dev
   ```

## Docker

Para subir API + PostgreSQL com Docker Compose:

```bash
docker-compose up --build
```

A API sobe em `http://localhost:3333` e o banco em `localhost:5438`.

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
- `npm run prisma:seed`: cria usuario admin e dados iniciais.

## Keep Alive (GitHub Actions)

O workflow `.github/workflows/keep-alive.yml` executa pings periódicos no backend e no Supabase.

Configure os valores em `Settings > Secrets and variables > Actions` (Secrets ou Variables):

- `RENDER_BACKEND_URL` (ex.: `https://seu-backend.onrender.com`)
- `SUPABASE_URL` (ex.: `https://xxxx.supabase.co`)
- `SUPABASE_ANON_KEY`

> Dica: salve os valores sem aspas (`"` ou `'`) e com URL completa (`https://...`).

Tambem e possivel executar manualmente em `workflow_dispatch` informando os inputs opcionais
(`render_backend_url`, `supabase_url`, `supabase_anon_key`).

## Seed inicial

O seed cria:

- Usuario admin com roles `ROLE_ADMIN` e `ROLE_USER`
- Categorias demo
- Autores demo
- Livro demo (`1984`)

Variaveis opcionais para admin:

- `SEED_ADMIN_NAME`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

## Estrutura

- `src/modules/*`: modulos de dominio (auth, users, books, authors, categories, loans, dashboard)
- `src/shared/infra`: infraestrutura compartilhada (HTTP, middleware, banco)
- `src/config`: configuracoes de ambiente

## Endpoints principais

### Publicos

- `GET /health` -> `{ "status": "ok" }`
- `POST /auth/register`
- `POST /auth/login`

### Protegidos (JWT)

- `GET /users/me`
- `GET /books`
- `GET /books/:id`
- `GET /loans/me`

### Somente admin (`ROLE_ADMIN`)

- `GET /users`
- `POST /users`
- `POST /authors`
- `GET /authors`
- `GET /authors/:id`
- `PUT /authors/:id`
- `DELETE /authors/:id`
- `POST /categories`
- `GET /categories`
- `GET /categories/:id`
- `PUT /categories/:id`
- `DELETE /categories/:id`
- `POST /books`
- `PUT /books/:id`
- `DELETE /books/:id`
- `POST /loans`
- `POST /loans/:id/return`
- `GET /loans/active`
- `GET /loans/overdue`
- `GET /loans/history`
- `GET /dashboard/stats`

## Funcionalidades implementadas

- Autenticacao com JWT e RBAC (role admin).
- Cadastro publico com politica de senha forte e hash com bcrypt.
- CRUD de autores.
- CRUD de categorias.
- CRUD de livros com validacao de categoria/autores e bloqueio de exclusao de livro emprestado.
- Cadastro de leitor por admin com senha automatica.
- Fluxo de emprestimo e devolucao com calculo de atraso.
- Listagens de emprestimos ativos, atrasados, historico e area do usuario.
- Dashboard administrativo com metricas agregadas e dados recentes de emprestimos.
- Tratamento centralizado de erros.

## Funcionalidades nao implementadas

- Envio de senha automatica por e-mail no cadastro de leitor (somente retorno no payload da API).
- Paginacao e ordenacao configuravel nas listagens.

## Justificativas

- O envio de senha por e-mail foi mantido fora do escopo para evitar acoplamento com provedor SMTP nesta etapa.
- A paginacao foi adiada para priorizar cobertura dos fluxos funcionais obrigatorios do desafio.
