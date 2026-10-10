FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY shared/package.json ./shared/package.json
COPY backend/prisma ./backend/prisma
COPY backend/prisma.config.ts ./backend/prisma.config.ts


RUN npm ci

COPY backend ./backend
COPY shared ./shared

WORKDIR /app/backend

EXPOSE 4000

CMD ["npm", "run", "server"]