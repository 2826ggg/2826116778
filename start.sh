#!/bin/bash

echo "🚀 Starting Virtual Trading Platform..."

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "📦 Building Docker images..."
docker-compose build

echo "🏃 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🗄️  Initializing database..."
docker-compose exec -T backend npm run init:db

echo ""
echo "✅ Platform is running!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo "   API Docs: http://localhost:5000/api/docs"
echo ""
echo "👤 Demo Account:"
echo "   Email: demo@example.com"
echo "   Password: demo123456"
echo ""
echo "🔐 Admin Account:"
echo "   Username: admin"
echo "   Password: admin123456"
echo ""
echo "📖 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"
echo ""
