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

# Copy backend
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy frontend
COPY --from=frontend-builder /app/.next /app/frontend/.next
COPY --from=frontend-builder /app/next.config.js /app/frontend/
COPY --from=frontend-builder /app/package*.json /app/frontend/
RUN cd /app/frontend && npm ci --omit=dev

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

CMD ["/entrypoint.sh"]
