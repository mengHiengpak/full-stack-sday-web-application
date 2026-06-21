#!/bin/sh
set -e

# Backend runs internally on 5000
PORT=5000 node /app/dist/server.js &
BACKEND_PID=$!

# Frontend runs on Render's PORT (or 3000 locally)
cd /app/frontend
API_URL=http://localhost:5000 PORT=${PORT:-3000} npm start &
FRONTEND_PID=$!

trap 'kill $BACKEND_PID $FRONTEND_PID; exit' SIGTERM SIGINT
wait
