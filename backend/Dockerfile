FROM node:18-alpine AS build

WORKDIR /app

# Install openssl for Prisma
RUN apk --no-cache add openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Install openssl for Prisma and nc for waiting
RUN apk --no-cache add openssl netcat-openbsd

# Copy package files
COPY package*.json ./

# Copy prisma schema and seed files
COPY prisma ./prisma/

# Install dependencies (including bcrypt for seed)
RUN npm ci --only=production && npm install --no-save bcrypt

# Generate Prisma Client in production image
RUN npx prisma generate

# Create dist directory and copy built application
RUN mkdir -p dist
COPY --from=build /app/dist/. /app/dist/
COPY --from=build /app/prisma ./prisma

# Copy entrypoint script
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Expose port
EXPOSE 3001

# Start the application with entrypoint
ENTRYPOINT ["./entrypoint.sh"]

