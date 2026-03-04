# Desafio Prático --- Sistema de Gerenciamento de Empréstimos de Livros

Versão adaptada para **Node.js + React**

Este documento descreve os requisitos técnicos e funcionais de um
sistema completo de gerenciamento de empréstimos de livros.\
O objetivo é permitir que um agente de IA ou desenvolvedor implemente o
sistema seguindo as especificações abaixo.

------------------------------------------------------------------------

# 1. Stack Tecnológica Obrigatória

## Backend

-   Node.js
-   TypeScript (preferencial)
-   Framework sugerido: Express ou NestJS
-   ORM: Prisma ou TypeORM
-   Banco de dados: PostgreSQL
-   Autenticação: JWT
-   Hash de senha: bcrypt
-   Testes unitários: Jest

## Frontend

-   React
-   Vite
-   TypeScript
-   TailwindCSS

## Infraestrutura

-   Docker
-   Docker Compose

------------------------------------------------------------------------

# 2. Objetivo do Sistema

Construir um **Sistema de Gerenciamento de Empréstimos de Livros**
contendo:

-   Autenticação de usuários
-   CRUD de livros
-   CRUD de autores
-   CRUD de categorias
-   Cadastro de leitores
-   Sistema de empréstimo de livros
-   Sistema de devolução de livros
-   Histórico de empréstimos
-   Testes unitários

------------------------------------------------------------------------

# 3. Requisitos Arquiteturais

O backend deve seguir boas práticas como:

-   Arquitetura em camadas
-   Controllers
-   Services
-   Repositories
-   DTOs
-   Validação de dados
-   Tratamento de erros centralizado

Estrutura sugerida:

    backend/
      src/
        controllers/
        services/
        repositories/
        routes/
        middlewares/
        dtos/
        entities/
        tests/

Frontend sugerido:

    frontend/
      src/
        pages/
        components/
        services/
        hooks/
        contexts/

------------------------------------------------------------------------

# 4. Infraestrutura Docker

Criar ambiente com:

-   Node backend
-   React frontend
-   PostgreSQL

Exemplo de serviços:

-   backend
-   frontend
-   database

------------------------------------------------------------------------

# 5. Requisitos Funcionais

# 5.1 Auto Cadastro de Usuário

O sistema deve permitir que usuários se registrem.

Campos obrigatórios:

-   nome
-   email
-   senha

Regras:

-   Email deve ser único
-   Senha deve conter:
    -   mínimo 8 caracteres
    -   letra maiúscula
    -   letra minúscula
    -   número
    -   caractere especial

Após cadastro:

-   usuário recebe role: `ROLE_USER`
-   status inicial: `ativo`
-   senha deve ser **criptografada com bcrypt**

Resposta esperada:

-   sucesso ou erro com mensagem clara.

------------------------------------------------------------------------

# 5.2 Autenticação

Login com:

-   email
-   senha

Se válido:

Gerar **JWT** contendo:

-   id
-   email
-   roles

Regras:

-   JWT deve possuir expiração
-   Não revelar se erro foi email ou senha

------------------------------------------------------------------------

# 5.3 Proteção de Rotas

Rotas protegidas devem exigir:

-   JWT válido

Caso inválido:

Retornar:

    HTTP 401 Unauthorized

Middleware deve:

-   validar token
-   extrair dados do usuário

------------------------------------------------------------------------

# 6. CRUD de Livros

Acesso: `ROLE_ADMIN`

Campos:

-   titulo
-   ano_publicacao
-   categoria
-   autores

Regras:

-   título obrigatório
-   título único
-   livro deve possuir pelo menos 1 autor
-   categoria obrigatória
-   status inicial: `disponível`

Exclusão:

-   não pode excluir livro emprestado

------------------------------------------------------------------------

# 7. CRUD de Autores

Acesso: `ROLE_ADMIN`

Campos:

-   nome (obrigatório)
-   biografia (opcional)

Regras:

-   listar
-   editar
-   excluir

Ao excluir:

-   verificar se autor está associado a livros

Opções:

-   impedir exclusão OU
-   desassociar livros

------------------------------------------------------------------------

# 8. CRUD de Categorias

Acesso: `ROLE_ADMIN`

Campos:

-   nome

Regras:

-   nome obrigatório
-   nome único

Ao excluir:

-   verificar se existem livros associados

Possíveis soluções:

-   impedir exclusão OU
-   exigir reclassificação dos livros

------------------------------------------------------------------------

# 9. Cadastro de Leitores

Acesso: `ROLE_ADMIN`

Campos:

-   nome
-   email
-   telefone

Senha:

-   gerada automaticamente
-   enviada ao usuário

Role padrão:

    ROLE_USER

------------------------------------------------------------------------

# 10. Empréstimo de Livros

Regras:

-   somente livros disponíveis podem ser emprestados
-   usuário deve existir
-   livro deve existir

Ao registrar empréstimo:

Registrar:

-   livro
-   usuário
-   data_emprestimo

Gerar automaticamente:

    data_devolucao_prevista = data_emprestimo + 14 dias

Atualizar status do livro:

    emprestado

------------------------------------------------------------------------

# 11. Devolução de Livros

Acesso: `ROLE_ADMIN`

Regras:

-   só pode devolver se existir empréstimo ativo

Ao devolver:

Registrar:

-   data_devolucao_real

Atualizar livro:

    disponível

Calcular:

    dias_atraso

Se houver atraso:

    status = atrasado

------------------------------------------------------------------------

# 12. Listagem de Empréstimos

O sistema deve listar:

### Empréstimos ativos

Mostrar:

-   livro
-   usuário
-   data empréstimo
-   data devolução prevista

Filtros:

-   por usuário

------------------------------------------------------------------------

### Livros em atraso

Listar empréstimos com:

    data_devolucao_prevista < data_atual

------------------------------------------------------------------------

### Área do usuário

Usuário deve ver:

-   livros emprestados
-   data limite

Se vencido:

-   data exibida em vermelho

------------------------------------------------------------------------

# 13. Histórico de Empréstimos

O sistema deve manter histórico completo.

Registrar:

-   livro
-   usuário
-   data empréstimo
-   data devolução

Administrador pode filtrar:

-   por usuário
-   por livro

Usuário pode visualizar:

-   histórico pessoal

------------------------------------------------------------------------

# 14. Modelagem do Banco de Dados

## Livro

    id
    titulo (unique)
    ano_publicacao
    categoria_id
    status
    created_at
    updated_at

------------------------------------------------------------------------

## Autor

    id
    nome
    biografia
    created_at
    updated_at

------------------------------------------------------------------------

## LivroAutor

    livro_id
    autor_id
    PRIMARY KEY (livro_id, autor_id)

------------------------------------------------------------------------

## Categoria

    id
    nome (unique)
    created_at
    updated_at

------------------------------------------------------------------------

## Usuario

    id
    nome
    email
    telefone
    senha
    roles
    created_at
    updated_at

------------------------------------------------------------------------

## Emprestimo

    id
    livro_id
    usuario_id
    data_emprestimo
    data_devolucao_prevista
    data_devolucao_real
    status
    dias_atraso
    created_at
    updated_at

------------------------------------------------------------------------

# 15. Testes Unitários

Criar testes para:

-   cadastro de usuário
-   login
-   criação de livro
-   empréstimo
-   devolução
-   cálculo de atraso

Framework:

    Jest

------------------------------------------------------------------------

# 16. README do Projeto

O README deve conter:

-   descrição do projeto
-   tecnologias utilizadas
-   instruções para rodar

### Executar projeto

    docker-compose up

### Backend

    npm install
    npm run dev

### Frontend

    npm install
    npm run dev

### Rodar testes

    npm run test

Também deve listar:

-   funcionalidades implementadas
-   funcionalidades não implementadas
-   justificativas
