#!/bin/bash

echo "🛑 Stopping Virtual Trading Platform..."
echo ""

if docker-compose down; then
    echo "✅ All services stopped and removed"
    echo ""
    echo "💡 To start again: ./start.sh"
else
    echo "❌ Error stopping services"
    exit 1
fi
