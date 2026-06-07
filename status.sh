#!/bin/bash

echo "📊 Virtual Trading Platform Status"
echo "═══════════════════════════════════════════════════════════"
echo ""

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi

echo "🐳 Container Status:"
echo ""
docker-compose ps

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📈 Service Health:"
echo ""

echo -n "MySQL:        "
if docker-compose exec -T mysql mysqladmin ping -h localhost &>/dev/null; then
    echo "✅ Running"
else
    echo "❌ Not responding"
fi

echo -n "Redis:        "
if docker-compose exec -T redis redis-cli ping &>/dev/null; then
    echo "✅ Running"
else
    echo "❌ Not responding"
fi

echo -n "Backend API:  "
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Running"
else
    echo "❌ Not responding"
fi

echo -n "Frontend:     "
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Running"
else
    echo "❌ Not responding"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo "   Admin Panel: http://localhost:3000/admin"
echo ""
