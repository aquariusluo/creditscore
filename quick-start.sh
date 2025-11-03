#!/bin/bash
# Quick Start Script - Private Credit Score Application
# This script sets up everything needed to run the application on localhost:3000

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║    🔐 Private Credit Score - Quick Start for localhost:3000   ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the creditscore directory"
    echo "   Usage: cd /home/zama/creditscore && bash quick-start.sh"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Installing dependencies...${NC}"
cd frontend
npm install --loglevel=error > /dev/null 2>&1
cd ..
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${BLUE}Step 2: Configuration check...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}ℹ️  .env file not found. Using defaults for localhost development.${NC}"
fi
echo -e "${GREEN}✓ Configuration ready${NC}"
echo ""

echo -e "${BLUE}Step 3: Starting development server...${NC}"
echo ""
echo "🚀 Development server starting on http://localhost:3000"
echo ""
echo "📝 You can now:"
echo "   • Browse the home page"
echo "   • Navigate through all pages"
echo "   • Read documentation"
echo "   • Connect your MetaMask wallet (optional)"
echo "   • Try the credit score application"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

# Start the development server
cd frontend
npm start
