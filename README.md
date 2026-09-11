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