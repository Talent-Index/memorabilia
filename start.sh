#!/bin/bash

# Memorabilia Quick Start Script
# This script helps you get the game running quickly

set -e

echo "🎮 Memorabilia Quick Start"
echo "=========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Dojo is installed
check_dojo() {
    echo -e "${BLUE}Checking Dojo installation...${NC}"
    if ! command -v sozo &> /dev/null; then
        echo -e "${RED}❌ Dojo not found!${NC}"
        echo ""
        echo "Install Dojo with:"
        echo "  curl -L https://install.dojoengine.org | bash"
        echo "  dojoup"
        echo ""
        exit 1
    fi
    echo -e "${GREEN}✅ Dojo found: $(sozo --version)${NC}"
}

# Check if Katana is running
check_katana() {
    echo -e "${BLUE}Checking if Katana is running...${NC}"
    if curl -s http://localhost:5050 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Katana is running${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Katana not running${NC}"
        return 1
    fi
}

# Build contracts
build_contracts() {
    echo ""
    echo -e "${BLUE}Building contracts...${NC}"
    sozo build
    echo -e "${GREEN}✅ Contracts built${NC}"
}

# Run tests
run_tests() {
    echo ""
    echo -e "${BLUE}Running tests...${NC}"
    sozo test
    echo -e "${GREEN}✅ Tests passed${NC}"
}

# Deploy contracts
deploy_contracts() {
    echo ""
    echo -e "${BLUE}Deploying contracts to Katana...${NC}"
    sozo migrate apply
    echo -e "${GREEN}✅ Contracts deployed${NC}"
    echo ""
    echo -e "${YELLOW}📝 Save the World address shown above!${NC}"
}

# Setup frontend
setup_frontend() {
    echo ""
    echo -e "${BLUE}Setting up frontend...${NC}"
    
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    if [ ! -f ".env" ]; then
        echo "Creating .env file..."
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Please edit frontend/.env and set VITE_WORLD_ADDRESS${NC}"
    fi
    
    cd ..
    echo -e "${GREEN}✅ Frontend setup complete${NC}"
}

# Start frontend
start_frontend() {
    echo ""
    echo -e "${BLUE}Starting frontend...${NC}"
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    echo -e "${GREEN}   Open http://localhost:3000${NC}"
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo ""
    echo "1) Full setup (build, test, deploy, start frontend)"
    echo "2) Build contracts only"
    echo "3) Run tests only"
    echo "4) Deploy to Katana"
    echo "5) Setup frontend"
    echo "6) Start frontend"
    echo "7) Start Katana (in new terminal)"
    echo "8) Exit"
    echo ""
    read -p "Enter choice [1-8]: " choice
}

# Handle menu choice
handle_choice() {
    case $choice in
        1)
            check_dojo
            if ! check_katana; then
                echo ""
                echo -e "${YELLOW}Please start Katana first:${NC}"
                echo "  Open a new terminal and run: katana --disable-fee"
                echo ""
                read -p "Press Enter when Katana is running..."
            fi
            build_contracts
            run_tests
            deploy_contracts
            setup_frontend
            start_frontend
            echo ""
            echo -e "${GREEN}🎉 All done!${NC}"
            echo ""
            echo "Next steps:"
            echo "1. Copy the World address from above"
            echo "2. Edit frontend/.env and set VITE_WORLD_ADDRESS"
            echo "3. Restart the frontend: cd frontend && npm run dev"
            echo "4. Open http://localhost:3000"
            ;;
        2)
            check_dojo
            build_contracts
            ;;
        3)
            check_dojo
            run_tests
            ;;
        4)
            check_dojo
            if ! check_katana; then
                echo ""
                echo -e "${RED}Katana is not running!${NC}"
                echo "Start it with: katana --disable-fee"
                exit 1
            fi
            deploy_contracts
            ;;
        5)
            setup_frontend
            ;;
        6)
            start_frontend
            ;;
        7)
            echo ""
            echo -e "${BLUE}Starting Katana...${NC}"
            echo ""
            katana --disable-fee
            ;;
        8)
            echo "Goodbye! 👋"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            ;;
    esac
}

# Main
main() {
    while true; do
        show_menu
        handle_choice
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run
main

