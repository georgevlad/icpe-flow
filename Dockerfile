FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY index.html tsconfig.json vite.config.ts ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node package.json ./
COPY --chown=node:node server ./server
COPY --from=build --chown=node:node /app/dist ./dist
RUN mkdir /app/data && chown node:node /app/data
USER node
EXPOSE 3101
CMD ["node", "server/production.mjs"]
