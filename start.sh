#!/bin/bash

set -e

echo "🚀 Starting Virtual Trading Platform..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is running
echo "${BLUE}[1/5]${NC} Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi
echo "${GREEN}✅ Docker found${NC}"

# Check if docker-compose is available
echo "${BLUE}[2/5]${NC} Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi
echo "${GREEN}✅ Docker Compose found${NC}"

# Build images
echo "${BLUE}[3/5]${NC} Building Docker images..."
if docker-compose build; then
    echo "${GREEN}✅ Docker images built${NC}"
else
    echo "${RED}❌ Failed to build Docker images${NC}"
    exit 1
fi

# Start services
echo "${BLUE}[4/5]${NC} Starting services..."
if docker-compose up -d; then
    echo "${GREEN}✅ Services started${NC}"
else
    echo "${RED}❌ Failed to start services${NC}"
    exit 1
fi

# Wait for services to be ready
echo "${BLUE}[5/5]${NC} Waiting for services to be ready (this may take 30-60 seconds)..."
sleep 15

# Initialize database
echo ""
echo "${BLUE}🔧 Initializing database...${NC}"
if docker-compose exec -T backend npm run init:db; then
    echo "${GREEN}✅ Database initialized${NC}"
else
    echo "${YELLOW}⚠️  Database initialization encountered an issue (may be already initialized)${NC}"
fi

echo ""
echo "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo "${GREEN}✅ Virtual Trading Platform is running!${NC}"
echo "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "${BLUE}🌐 Access URLs:${NC}"
echo "   ${GREEN}Frontend:${NC}      http://localhost:3000"
echo "   ${GREEN}Backend API:${NC}    http://localhost:5000/api"
echo "   ${GREEN}API Docs:${NC}       http://localhost:5000/api/docs"
echo "   ${GREEN}Admin Panel:${NC}    http://localhost:3000/admin"
echo ""
echo "${BLUE}👤 Demo Account:${NC}"
echo "   ${GREEN}Email:${NC}         demo@example.com"
echo "   ${GREEN}Password:${NC}      demo123456"
echo "   ${GREEN}Initial Balance:${NC} \$10,000 USD"
echo ""
echo "${BLUE}🔐 Admin Account:${NC}"
echo "   ${GREEN}Username:${NC}      admin"
echo "   ${GREEN}Password:${NC}      admin123456"
echo ""
echo "${BLUE}📚 Useful Commands:${NC}"
echo "   ${GREEN}View all services:${NC}    ./status.sh"
echo "   ${GREEN}View logs:${NC}              docker-compose logs -f"
echo "   ${GREEN}Stop services:${NC}          ./stop.sh"
echo "   ${GREEN}Restart services:${NC}       docker-compose restart"
echo "   ${GREEN}Reset database:${NC}         docker-compose exec backend npm run init:db"
echo ""
echo "${YELLOW}💡 First time setup complete! Open http://localhost:3000 in your browser.${NC}"
echo ""
