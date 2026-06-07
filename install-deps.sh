#!/bin/bash

echo "📦 Installing dependencies..."

cd backend
npm install
echo "✅ Backend dependencies installed"

cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "✨ Setup complete!"
echo "Run './start.sh' to start the platform"
