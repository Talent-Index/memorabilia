#!/bin/bash

echo "🚀 Deploying Memorabilia to Sepolia testnet..."

# Build the project
echo "Building contracts..."
sozo build

# Deploy to Sepolia
echo "Deploying to Sepolia..."
sozo migrate --profile sepolia

# Store the world address
echo "Deployment complete! Don't forget to:"
echo "1. Copy the World address from above"
echo "2. Update world_address in Scarb.toml sepolia profile"
echo "3. Update frontend .env with the new World address"