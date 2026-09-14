# ServiceHub

ServiceHub is a self-hosted platform for monitoring and managing applications. It consists of a backend (NestJS) and a frontend (React) orchestrated with Docker Compose.

## 🚀 Quick Start (Production)

You only need two files on the host: `docker-compose.yml` and `.env`.

### 1. Create the directory and files

```bash
mkdir -p /opt/servicehub
cd /opt/servicehub
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: servicehub-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: servicehub_db
      POSTGRES_USER: servicehub_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - servicehub-network

  backend:
    image: ghcr.io/thmathe-us/servicehub-backend:latest
    container_name: servicehub-backend
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - DATABASE_URL=postgresql://servicehub_user:${POSTGRES_PASSWORD}@postgres:5432/servicehub_db
      - JWT_SECRET=${JWT_SECRET:-your-super-secret-jwt-key-change-in-production}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET:-your-super-secret-refresh-key-change-in-production}
      - NODE_ENV=production
      - PORT=3001
      - GITHUB_REPO=${GITHUB_REPO}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - CURRENT_VERSION=${CURRENT_VERSION}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./docker-compose.yml:/docker-compose.yml:ro
      - ./.env:/.env:ro
    ports:
      - "3000:3001"
    depends_on:
      - postgres
    entrypoint: ./entrypoint.sh
    networks:
      - servicehub-network

  frontend:
    image: ghcr.io/thmathe-us/servicehub-frontend:latest
    container_name: servicehub-frontend
    restart: unless-stopped
    environment:
      - VITE_API_URL=http://localhost:3000
    ports:
      - "8080:80"
    depends_on:
      - backend
    networks:
      - servicehub-network

volumes:
  postgres_data:

networks:
  servicehub-network:
    driver: bridge
```

Create `.env` (adjust the values):

```dotenv
# Required
POSTGRES_PASSWORD=your_postgres_password_here
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
GITHUB_REPO=thmathe-us/ServiceHub   # or your own fork
# Optional: increase GitHub API rate limit
GITHUB_TOKEN=your_github_personal_access_token   # leave empty for unauthenticated (60 req/h)
# The update service will keep this in sync with the latest release
CURRENT_VERSION=0.0.0
```

### 2. Start the stack

```bash
docker compose up -d
```

### 3. Access the application

Open your browser at `http://<host_ip>:8080`.

## 🔄 Automatic Updates

The backend includes an update service that checks GitHub for new releases every 6 hours. When a newer version is found, it:

1. Updates `CURRENT_VERSION` in the host's `.env` file.
2. Runs `docker compose pull backend frontend` to fetch the latest images.
3. Runs `docker compose up -d backend frontend` to restart the containers with the new images.

No manual intervention is required. The update service uses the `docker-compose.yml` and `.env` files mounted into the backend container (read‑only) to execute the commands on the host.

## 🛠️ Development

If you wish to modify the code and run locally:

### Backend
```bash
cd backend
cp .env.example .env   # adjust as needed
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

## 📦 How Images Are Built and Published

A GitHub Actions workflow (`.github/workflows/docker.yml`) runs on every push to the `main` branch:

1. Checks out the repository.
2. Logs into GitHub Container Registry (GHCR) using the built-in `GITHUB_TOKEN`.
3. Builds and pushes the backend image to `ghcr.io/<owner>/servicehub-backend:latest`.
4. Builds and pushes the frontend image to `ghcr.io/<owner>/servicehub-frontend:latest`.

The `docker-compose.yml` above points to these `latest` tags, so a simple `docker compose pull` will get the most recent successful build.

## 🔐 Security Notes

- The PostgreSQL password is set exclusively via the `POSTGRES_PASSWORD` environment variable (no `trust` authentication).
- JWT secrets are also environment‑only; generate strong random values.
- The backend container mounts the host's Docker socket (`/var/run/docker.sock`) **only** to allow the update service to run `docker compose`. No other host directories are mounted.
- The `docker-compose.yml` and `.env` files are mounted read‑only into the backend container for the update service's use.

## 🐳 Volumes and Networks

- `postgres_data`: Persistent volume for the PostgreSQL database.
- `servicehub-network`: Internal bridge network for inter‑service communication.

## 📄 License

This project is licensed under the MIT License – see the `LICENSE` file for details.

## 🙏 Support

For issues or questions, please open a GitHub issue in the repository.
