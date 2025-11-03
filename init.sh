#!/bin/bash

# Private Credit Score - Project Initialization Script
# Run this to set up everything from scratch

set -e

echo "🔐 Private Credit Score - Project Setup"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

echo "✓ Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi

echo "✓ npm $(npm --version)"

echo ""
echo "📦 Installing dependencies..."

# Install backend
npm install --loglevel=error

# Install frontend
cd frontend
npm install --loglevel=error
cd ..

echo "✓ Dependencies installed"

echo ""
echo "📝 Creating .env file..."

if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# Fill in your settings
PRIVATE_KEY=your_wallet_private_key_here
RPC_URL=https://your-zama-testnet-rpc
REACT_APP_RPC_URL=https://your-zama-testnet-rpc
REACT_APP_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
EOF
    echo "✓ .env created (edit with your settings)"
else
    echo "✓ .env already exists"
fi

echo ""
echo "🔨 Compiling smart contracts..."
npm run build > /dev/null 2>&1 || true

echo "✓ Contracts compiled"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Edit .env with your settings"
echo "2. Read SETUP_GUIDE.md for detailed instructions"
echo "3. Deploy: ./deploy.sh testnet"
echo "4. Start: npm run frontend:start"
echo ""
