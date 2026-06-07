#!/bin/bash

echo "🧹 Cleaning up Docker resources..."
echo ""

echo "Stopping containers..."
docker-compose down -v

echo "Removing images..."
docker rmi trading-platform-frontend trading-platform-backend 2>/dev/null || true

echo ""
echo "✅ Cleanup complete"
echo ""
echo "💡 To start fresh: ./start.sh"
