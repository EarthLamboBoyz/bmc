#!/bin/bash

# BrandMeetCreator Deployment Script
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

ENV=${1:-production}
echo "🚀 Deploying BrandMeetCreator to $ENV environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Step 1: Build Backend
echo "📦 Building backend..."
cd backend
npm ci
npm run build
cd ..

# Step 2: Deploy with Docker Compose
echo "🐳 Building and starting Docker containers..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Step 3: Run database migrations
echo "🗄️ Running database migrations..."
sleep 5
docker-compose exec -T backend npx prisma migrate deploy || true

# Step 4: Health check
echo "🏥 Checking health..."
sleep 10

# Check backend health
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Check frontend health
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

echo ""
echo "🎉 Deployment complete!"
echo "📱 Frontend: http://localhost"
echo "🔌 API: http://localhost:3001"
echo ""
echo "📊 View logs: docker-compose logs -f"
