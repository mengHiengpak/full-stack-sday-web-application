FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY sbay-back-end/package*.json ./
RUN npm ci
COPY sbay-back-end/ .
RUN npm run build

FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY sbay-front-end/package*.json ./
RUN npm ci
COPY sbay-front-end/ .
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache ffmpeg python3 curl ca-certificates \
  && curl -sL https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
  && chmod +x /usr/local/bin/yt-dlp \
  && yt-dlp --version

WORKDIR /app

COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/next.config.js ./
COPY --from=frontend-builder /app/package.json ./frontend-package.json

EXPOSE 5000

CMD ["node", "dist/server.js"]
