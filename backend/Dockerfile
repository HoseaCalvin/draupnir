FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --omit=dev

ENV NODE_ENV=production

EXPOSE 5001

CMD ["node", "dist/app.js"]