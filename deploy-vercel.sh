#!/bin/bash
# Deploy to your GitHub repository and Vercel

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║  🚀 Deploy to Vercel - aquariusluo/creditscore               ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run from creditscore directory"
    exit 1
fi

echo -e "${BLUE}Step 1: Checking git status...${NC}"
git status
echo ""

echo -e "${BLUE}Step 2: Adding all files...${NC}"
git add .
echo -e "${GREEN}✓ Files added${NC}"
echo ""

echo -e "${BLUE}Step 3: Creating commit...${NC}"
COMMIT_MSG="Deploy: Private Credit Score Application to Vercel"
git commit -m "$COMMIT_MSG" || echo -e "${YELLOW}ℹ️  No changes to commit${NC}"
echo ""

echo -e "${BLUE}Step 4: Pushing to GitHub...${NC}"
git push origin main
echo -e "${GREEN}✓ Code pushed to GitHub${NC}"
echo ""

echo -e "${GREEN}✅ DEPLOYMENT READY!${NC}"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Go to: https://vercel.com/new"
echo "2. Import your GitHub repository: aquariusluo/creditscore"
echo "3. Set Root Directory to: frontend"
echo "4. Add environment variables:"
echo "   - REACT_APP_RPC_URL: your-rpc-url"
echo "   - REACT_APP_CONTRACT_ADDRESS: 0x..."
echo "5. Click Deploy"
echo ""
echo "Your app will be live in 2-3 minutes! 🎉"
echo ""
echo "Live URL will be: https://creditscore-aquariusluo.vercel.app"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
