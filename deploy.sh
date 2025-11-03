#!/bin/bash

# Private Credit Score - Deployment Script
# Usage: ./deploy.sh [network]

set -e

NETWORK=${1:-localhost}
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🚀 Private Credit Score Deployment"
echo "=================================="
echo "Network: $NETWORK"
echo ""

# Check if .env exists
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env with the following variables:"
    echo "  PRIVATE_KEY=your_private_key"
    echo "  RPC_URL=https://your-rpc-url"
    echo "  REACT_APP_RPC_URL=https://your-rpc-url"
    exit 1
fi

# Load environment
source "$SCRIPT_DIR/.env"

echo "✓ Environment loaded"
echo ""

# Compile contract
echo "📝 Compiling smart contract..."
npm run build

echo "✓ Compilation successful"
echo ""

# Deploy contract
echo "🌍 Deploying to $NETWORK..."
if [ "$NETWORK" = "localhost" ]; then
    npm run deploy
else
    npm run deploy:testnet
fi

echo "✓ Deployment successful"
echo ""

# Extract contract address from deployment output
CONTRACT_ADDRESS=$(cat deployments/$NETWORK/PrivateCreditScore.json 2>/dev/null | grep '"address"' | head -1 | cut -d'"' -f4)

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "⚠️  Could not extract contract address"
    echo "Please set REACT_APP_CONTRACT_ADDRESS in .env manually"
else
    echo "📋 Contract Address: $CONTRACT_ADDRESS"
    echo ""
    echo "Update your .env with:"
    echo "  REACT_APP_CONTRACT_ADDRESS=$CONTRACT_ADDRESS"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Update .env with REACT_APP_CONTRACT_ADDRESS"
echo "  2. Run: npm run frontend:start"
echo "  3. Connect MetaMask to $NETWORK"
echo "  4. Navigate to http://localhost:3000"
