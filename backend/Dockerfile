# ------- build stage -------
FROM node:20-alpine AS build
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --legacy-peer-deps
COPY backend .

RUN npx prisma generate

RUN chmod +x node_modules/.bin/nest && npm run build

# ------- runtime stage -------
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY backend/entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

RUN apk --no-cache add openssl netcat-openbsd docker-cli docker-compose

COPY docker-compose.yml ./docker-compose.yml

ENV NODE_ENV=production

EXPOSE 3001

ENTRYPOINT ["./entrypoint.sh"]