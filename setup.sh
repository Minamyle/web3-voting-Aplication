#!/usr/bin/env bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}  Voting dApp - Quick Start Setup${NC}"
echo -e "${GREEN}===============================================${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 14+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found${NC}"

# Install root dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd frontend
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env with your configuration${NC}"
fi

# Create frontend .env.local if it doesn't exist
if [ ! -f frontend/.env.local ]; then
    echo -e "${YELLOW}📝 Creating frontend/.env.local file...${NC}"
    cp frontend/.env.example frontend/.env.local
    echo -e "${YELLOW}⚠️  Please edit frontend/.env.local with your contract address${NC}"
fi

echo ""
echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}  Setup Complete! 🎉${NC}"
echo -e "${GREEN}===============================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Edit .env with your Sepolia RPC URL and private key"
echo "2. Run 'npm test' to test the smart contract"
echo "3. Run 'npm run deploy:sepolia' to deploy to Sepolia"
echo "4. Update frontend/.env.local with the contract address"
echo "5. Run 'npm run frontend' to start the frontend"
echo ""
echo -e "${GREEN}Happy voting! 🗳️${NC}"
