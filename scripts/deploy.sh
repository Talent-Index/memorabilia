#!/bin/bash

# Memorabilia Deployment Script
# This script deploys the Memorabilia game to Starknet using Dojo

set -e

echo "🎮 Memorabilia - On-Chain Memory Game Deployment"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if sozo is installed
if ! command -v sozo &> /dev/null; then
    echo -e "${RED}Error: sozo is not installed${NC}"
    echo "Please install Dojo: https://book.dojoengine.org/getting-started/quick-start.html"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "Scarb.toml" ]; then
    echo -e "${RED}Error: Scarb.toml not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${YELLOW}Step 1: Building the project...${NC}"
sozo build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"

echo -e "${YELLOW}Step 2: Running tests...${NC}"
sozo test

if [ $? -ne 0 ]; then
    echo -e "${RED}Tests failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Tests passed${NC}"

# Check for network argument
NETWORK=${1:-"katana"}

if [ "$NETWORK" == "katana" ]; then
    echo -e "${YELLOW}Step 3: Starting local Katana node...${NC}"
    echo "Please ensure Katana is running on http://localhost:5050"
    echo "Start Katana in another terminal with: katana --disable-fee"
    read -p "Press enter when Katana is ready..."
fi

echo -e "${YELLOW}Step 4: Migrating (deploying) to $NETWORK...${NC}"

if [ "$NETWORK" == "katana" ]; then
    sozo migrate apply
else
    sozo migrate apply --network $NETWORK
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}Migration failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Migration successful${NC}"

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Note the world address from the migration output"
echo "2. Update your frontend configuration with the world address"
echo "3. Start the Telegram Mini App"
echo ""
echo "Useful commands:"
echo "  sozo execute <SYSTEM> <FUNCTION> - Execute a system function"
echo "  sozo model get <MODEL> <KEY> - Query model data"
echo ""

