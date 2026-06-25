#!/bin/sh
set -e

export DATABASE_URL='postgresql://postgres.pwxltooedpwazzpagsvh:%40Menghieng096t@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres'
export JWT_SECRET='cajxX6dyR0YHlntPQbKTv21SIZ83FqiwL5DMpeumAEGUBOVWoNJCfr94k7szhg'
export JWT_EXPIRE='7d'
export SUPABASE_URL='https://pwxltooedpwazzpagsvh.supabase.co'
export SUPABASE_KEY='sb_publishable_zAhY_twQUYGtKXpNDyHUKA_hwUPgxrl'
export DB_SSL='true'
export NODE_ENV='production'

# Backend runs internally on 5000
PORT=5000 node /app/dist/server.js &
BACKEND_PID=$!

# Frontend runs on Render's PORT (or 3000 locally)
cd /app/frontend
API_URL=http://localhost:5000 PORT=${PORT:-3000} npm start &
FRONTEND_PID=$!

trap 'kill $BACKEND_PID $FRONTEND_PID; exit' SIGTERM SIGINT
wait
