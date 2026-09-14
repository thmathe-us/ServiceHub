# ------- build stage -------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# ------- runtime stage -------
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
# Install Docker client and compose plugin for host communication
RUN apk --no-cache add openssl netcat-openbsd docker-cli docker-compose
# Copia o compose que será usado pelo serviço de atualização
COPY docker-compose.yml ./docker-compose.yml
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/main.js"]