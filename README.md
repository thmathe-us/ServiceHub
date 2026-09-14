# ServiceHub - Self-Hosted Service Monitor & Dashboard

## 📋 Sobre o Projeto

ServiceHub é uma aplicação web completa para monitoramento e gerenciamento de serviços self-hosted. Com uma interface minimalista, elegante e moderna, o ServiceHub permite centralizar o monitoramento, acesso rápido, gestão de credenciais e organização de seus serviços internos.

## ✨ Características Principais

- **Monitoramento em Tempo Real**: Verificação de status HTTP/HTTPS, HEAD e Ping ICMP
- **Gestão de Credenciais Segura**: Criptografia AES-256 para senhas e tokens
- **Organização por Categorias e Tags**: Agrupe seus serviços por Infraestrutura, Streaming, Monitoramento, etc.
- **Sistema de Favoritos**: Marque os serviços mais importantes
- **Visualização em Grid e Lista**: Alterne entre diferentes visuais conforme sua preferência
- **Perfis de Acesso**: Administrador, Operador e Leitor com RBAC completo
- **Auditoria e Logs**: Registro completo de atividades no sistema
- **Notificações Preparadas**: Arquitetura pronta para Email, Telegram, Discord, Microsoft Teams e Webhooks

## 🛠️ Stack Tecnológica

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/UI
- React Query
- Axios

### Backend
- Node.js
- NestJS
- Prisma ORM
- PostgreSQL

### Infraestrutura
- Docker
- Docker Compose

## 🚀 Instruções de Instalação

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)

### Executando com Docker Compose

1. Clone o repositório:
```bash
git clone <repository-url>
cd servicehub
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

3. Inicie os containers:
```bash
docker-compose up -d --build
```

4. Acesse a aplicação:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger UI: http://localhost:3001/api/docs

### Credenciais Iniciais
- Usuário: `admin`
- Senha: `admin`

> ⚠️ **Importante**: Após o primeiro login, o sistema solicitará a alteração da senha inicial por motivos de segurança.

## 📁 Estrutura do Projeto

```
servicehub/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/            # Autenticação e autorização
│   │   ├── users/           # Gestão de usuários
│   │   ├── services/        # Monitoramento e gestão de serviços
│   │   ├── categories/      # Categorias e agrupamentos
│   │   ├── config/          # Configurações do sistema
│   │   ├── logs/            # Logs de auditoria
│   │   ├── healthcheck/     # Serviço de verificação de status
│   │   └── ...
│   ├── prisma/
│   │   ├── schema.prisma    # Modelo de dados
│   │   └── seed.ts          # Seed inicial
│   └── ...
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # Componentes UI
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── hooks/           # Hooks personalizados
│   │   ├── services/        # Serviços de API
│   │   ├── store/           # Estado global
│   │   └── ...
│   └── ...
├── docker-compose.yml       # Configuração Docker Compose
├── .env.example             # Exemplo de variáveis de ambiente
└── README.md
```

## 🔐 Segurança

- JWT e Refresh Tokens para autenticação
- Rate Limiting para proteção contra ataques de força bruta
- Proteção CSRF e XSS
- Helmet para headers de segurança
- Criptografia AES-256 para credenciais de serviços
- Hash bcrypt para senhas de usuários
- RBAC completo para controle de acesso

## 📄 Licença

Este projeto é licenciado sob a MIT License.
```
# ServiceHub

ServiceHub é uma plataforma de monitoramento e gerenciamento de aplicações auto-hospedadas, construida com:

- **Backend**: NestJS, Prisma, PostgreSQL
- **Frontend**: React, Vite, TypeScript
- **Orquestração**: Docker Compose

## Funcionalidades

- Monitoramento de serviços (status, logs, métricas)
- Gerenciamento de usuários e autenticação (JWT, refresh token, opcional 2FA)
- Configurações generales (tema, idioma, intervalo de verificação)
- **Atualizações automáticas**: verifica releases no GitHub e aplica atualizações via `docker-compose pull && up -d --build`
- Segurança: proteção de rotas, refresh de token, alteração de senha

## Pré-requisitos

- Docker Engine >= 20.10
- Docker Compose (v2)
- Node.js >= 18 (opcional, apenas para desenvolvimento local)
- Git

## Instalação (produção)

1. Clone o repositório:
   ```bash
   git clone <repository-url>
   cd servicehub
   ```

2. Copie o arquivo de exemplo de variáveis de ambiente e ajuste conforme necessário:
   ```bash
   cp .env.example .env   # Se existir, ou crie manualmente
   ```
   O arquivo `.env` deve conter:
   ```
   # Variáveis essenciais
   GITHUB_REPO=seu-usuario/seu-repo          # Repositório GitHub para verificar releases
   GITHUB_TOKEN=seu_token_pessoal            # Opcional, aumenta limite de requisições
   CURRENT_VERSION=0.0.0                     # Versão atual instalada (define como 0.0.0 para forçar verificação)
   POSTGRES_PASSWORD=sua_senha_segura        # Senha para o usuário do PostgreSQL
   JWT_SECRET=seu_segredo_jwt                 # Segredo para assinatura de access token
   JWT_REFRESH_SECRET=seu_segredo_refresh    # Segredo para refresh token
   ```

   Caso não exista `.env.example`, crie `.env` com o conteúdo acima.

3. Inicie os serviços:
   ```bash
   docker compose up -d
   ```

   O compose irá:
   - Criar a rede `servicehub-network`
   - Subir o PostgreSQL (porta 5432)
   - Construir e subir o backend (porta 3000 exposta como 3000->3001)
   - Construir e subir o frontend (porta 8080)

4. Acesse a interface:
   - URL: http://localhost:8080
   - Primeiro acesso: crie um usuário admin via tela de login (ou use as credenciais padrão se houver seed).

## Desenvolvimento

### Backend

```bash
cd backend
cp .env.example .env   # ajuste se necessário
npm install
npm run start:dev      # ou npm run start para modo produção
```

### Frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:3000 (ou conforme seu proxy)
npm install
npm run dev            # Vite dev server na porta 5173
```

### Testes

```bash
# Backend
npm test

# Frontend (se houver)
npm test
```

## Atualizações automáticas

O serviço de atualização roda em segundo plano (via `@Cron` no backend) e pode ser disparado manualmente:

- **Verificar atualizações**: botão “Checar Atualizações” na aba *Atualizações* das Configurações.
- **Aplicar atualização**: botão “Atualizar” (habilitado somente quando houver versão mais recente no GitHub).

O processo de atualização:
1. Busca a última tag no repositório definido em `GITHUB_REPO`.
2. Se a tag for maior que `CURRENT_VERSION` (lida do `.env`):
   - Atualiza o arquivo `.env` com `CURRENT_VERSION=<nova_tag>`.
   - Executa `docker-compose pull && docker-compose up -d --build` em segundo plano (usando o socket Docker do host e o código-fonte montado como volume).
3. Caso não haja nova versão, nada é feito.

### Variáveis de ambiente relevantes

| Variável          | Descrição                                                                                   |
|-------------------|---------------------------------------------------------------------------------------------|
| `GITHUB_REPO`     | Repositório no formato `usuario/repo` onde as releases são verificadas.                     |
| `GITHUB_TOKEN`    | Token pessoal do GitHub (opcional). Se ausente, o limite é 60 requisições/hora.            |
| `CURRENT_VERSION` | Versão atualmente instalada. Atualizada automaticamente após um update bem‑sucedido.        |
| `POSTGRES_PASSWORD`| Senha do usuário `servicehub_user` no banco PostgreSQL.                                    |
| `JWT_SECRET`      | Segredo usado para assinar os access tokens (mantenha secreto).                             |
| `JWT_REFRESH_SECRET`| Segredo usado para assinar os refresh tokens (mantenha secreto).                        |

## Estrutura do repositório

```
servicehub/
├── backend/               # Código NestJS
│   ├── src/
│   │   └── update/        # Serviço e controller de atualizações
│   ├── Dockerfile
│   └── entrypoint.sh
├── frontend/              # Código React/Vite
│   ├── src/
│   │   ├── pages/
│   │   │   └── Settings.tsx   # Aba de Atualizações
│   │   └── services/
│   │       └── updateApi.ts   # Chamadas ao backend de atualização
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml     # Orquestração
├── .env                   # Variáveis de ambiente (não versionar)
└── README.md
```

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo `LICENSE` para mais detalhes.

## Suporte

Para problemas ou dúvidas, abra uma issue no repositório ou entre em contato com a equipe de manutenção.
(Atualização da aplicação)
