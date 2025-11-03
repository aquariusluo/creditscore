# Private Credit Score - Comprehensive Setup Guide

## Quick Start (5 minutes)

### 1. Environment Setup

```bash
# Clone or initialize project
cd creditscore

# Create environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

### 2. Install Dependencies

```bash
# Backend
npm install

# Frontend
npm run frontend:install
```

### 3. Deploy Contract

```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh testnet
```

### 4. Start Application

```bash
# Terminal 1: Start frontend
npm run frontend:start

# Terminal 2: Monitor logs (optional)
npm run test
```

---

## Detailed Setup

### Prerequisites

**System Requirements:**
- Node.js 16+
- npm 8+
- 2GB RAM minimum
- Stable internet connection

**Wallet Setup:**
- MetaMask browser extension
- Testnet ETH for gas fees
- Zama FHE testnet added to network

### Zama Testnet Configuration

Add to MetaMask:

**Network Name:** Zama FHE Testnet
**RPC URL:** `https://testnet.zama.ai/rpc` (example)
**Chain ID:** 8545 (example)
**Currency:** ETH
**Block Explorer:** (varies by testnet)

### Installation Steps

#### 1. Backend Setup

```bash
# Install Hardhat and dependencies
npm install

# Verify installation
npx hardhat --version

# Compile contracts
npm run build

# Expected output: ✓ Compiled successfully
```

#### 2. Frontend Setup

```bash
cd frontend

# Install React dependencies
npm install

# Verify installation
npm list react

# Return to root
cd ..
```

#### 3. Configuration

```bash
# Copy example environment
cp .env.example .env

# Edit configuration
cat > .env << EOF
# Smart Contract
PRIVATE_KEY=your_wallet_private_key_without_0x
RPC_URL=https://your-zama-testnet-rpc

# Frontend
REACT_APP_RPC_URL=https://your-zama-testnet-rpc
REACT_APP_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Optional
ETHERSCAN_API_KEY=your_api_key
EOF
```

---

## Deployment Guide

### Local Deployment (Development)

```bash
# Start local Zama node (if available)
# or use a testnet

# Deploy to localhost
npx hardhat deploy --network localhost

# Expected output:
# PrivateCreditScore deployed to: 0x5FbDB2315678afccb333f8a9c27c3b923dd983d
```

### Testnet Deployment (Production)

```bash
# Deploy to testnet
npm run deploy:testnet

# Output: Contract address

# Update .env
REACT_APP_CONTRACT_ADDRESS=0x...

# Verify deployment
npx hardhat verify --network testnet 0x...
```

### Post-Deployment

```bash
# Save contract address
CONTRACT_ADDRESS=0x...

# Update frontend environment
sed -i "s/REACT_APP_CONTRACT_ADDRESS=.*/REACT_APP_CONTRACT_ADDRESS=$CONTRACT_ADDRESS/" .env

# Test connection
npm run frontend:start
```

---

## Usage Guide

### Step 1: Connect Wallet

1. Open application: `http://localhost:3000`
2. Click "Connect Wallet"
3. Approve MetaMask connection
4. Verify testnet is selected

### Step 2: Submit Credit Data

**Input your information:**
- Annual Income (in thousands)
  - Example: 150 = $150,000
  - Range: 0 - 1,000,000

- Total Assets (in thousands)
  - Example: 500 = $500,000
  - Range: 0 - 10,000,000

- Credit History (0-100 score)
  - Example: 85
  - Range: 0 - 100

**Click "Submit Encrypted Data"**
- Data is encrypted before sending
- Transaction appears in MetaMask
- Approve transaction
- Wait for confirmation

### Step 3: Compute Score

**Click "Compute Score"**
- Contract performs encrypted calculation
- Formula: `(income × 0.5 + assets × 0.3 + history × 0.2) / 100`
- Result stored encrypted on-chain

### Step 4: Reveal Score

**Click "Reveal My Score"**
- Your decryption key is used
- Score is decrypted on contract
- Only you can see your score
- Rating displayed:
  - 750+ : Excellent 📈
  - 650-749 : Good ✓
  - <650 : Needs Improvement ⚠️

---

## Command Reference

### Development Commands

```bash
# Build smart contracts
npm run build

# Run Hardhat tests
npm run test

# Run test suite script
bash scripts/test.sh

# Deploy contracts
npm run deploy

# Deploy to testnet
npm run deploy:testnet

# Start frontend (port 3000)
npm run frontend:start

# Build frontend
npm run frontend:build

# Calculate score (CLI)
python3 scripts/credit_calc.py 150 500 85
```

### Utility Commands

```bash
# Show Git status
git status

# Create commit
git add .
git commit -m "Update credit score system"

# View recent changes
git log --oneline -10
```

---

## Testing

### Unit Tests

```bash
# Run Forge tests
npm run test

# Specific test file
npx hardhat test test/CreditScore.t.sol
```

### Integration Tests

```bash
# Test credit calculation
python3 scripts/credit_calc.py 100 300 70

# Expected output includes:
# - valid: true
# - calculated_score: number
# - rating: string
```

### Manual Testing

```bash
# Test 1: Low score
python3 scripts/credit_calc.py 30 100 50

# Test 2: High score
python3 scripts/credit_calc.py 500 5000 100

# Test 3: Medium score
python3 scripts/credit_calc.py 200 1000 75
```

---

## Troubleshooting

### Connection Issues

**Error: Cannot connect to wallet**
```
Solution:
1. Ensure MetaMask is installed
2. Check testnet is selected
3. Verify RPC_URL in .env
```

**Error: RPC connection failed**
```
Solution:
1. Check internet connection
2. Verify RPC_URL is correct
3. Try alternative testnet endpoint
4. Wait for testnet to sync
```

### Deployment Issues

**Error: Insufficient gas**
```
Solution:
1. Request testnet ETH from faucet
2. Wait for confirmation
3. Retry deployment
```

**Error: Compilation failed**
```
Solution:
1. Check Solidity version (0.8.24)
2. Verify import paths
3. Run: npm run build
```

### Frontend Issues

**Error: Contract not found**
```
Solution:
1. Verify REACT_APP_CONTRACT_ADDRESS in .env
2. Ensure contract deployed to correct network
3. Check MetaMask is on correct network
```

**Error: MetaMask not detected**
```
Solution:
1. Install MetaMask extension
2. Reload page (Ctrl+F5)
3. Check browser console for errors
```

---

## Security Best Practices

### Private Key Management

⚠️ **NEVER:**
- Share private key
- Commit `.env` to git
- Use production key for testing
- Store unencrypted on public systems

✅ **DO:**
- Use testnet keys only
- Keep `.env` in `.gitignore`
- Rotate keys regularly
- Use hardware wallet for mainnet

### Contract Security

```bash
# Before deployment:
1. Run tests: npm run test
2. Check gas: npx hardhat gas-reporter
3. Verify logic: npm run build
4. Audit visually: grep -r "euint" contracts/
```

---

## Performance Optimization

### Gas Optimization

```javascript
// Batch operations when possible
await contract.computeMultipleScores([user1, user2, user3]);

// Avoid unnecessary computations
if (!hasScore) {
  await contract.computeMyScore();
}
```

### Frontend Optimization

```javascript
// Memoize expensive calculations
const memoizedScore = useMemo(() => calculateScore(...), [inputs]);

// Lazy load components
const AdvancedFeatures = lazy(() => import('./Advanced'));
```

---

## Monitoring & Logs

### Enable Logging

```bash
# Set debug level
DEBUG=* npm run frontend:start

# Or in contract
// Add emit events for tracking
emit CreditDataSubmitted(msg.sender, timestamp);
```

### View Transactions

1. Get contract address from deployment
2. Go to Zama testnet block explorer
3. Search for contract address
4. Review all transactions

---

## FAQ

**Q: How private is my data?**
A: All data encrypted end-to-end. Only you can decrypt your score.

**Q: Can anyone see my score?**
A: No. Score is encrypted on-chain. You decrypt it with your private key.

**Q: What if I lose my wallet?**
A: You cannot recover the score. Keep your seed phrase safe.

**Q: How much does it cost?**
A: Only testnet gas fees (minimal). Mainnet will depend on network.

**Q: Can I change my data?**
A: Yes, submit new data anytime. It overwrites previous.

**Q: How long does computation take?**
A: 1-2 minutes depending on network.

---

## Additional Resources

- **Zama Docs**: https://docs.zama.ai/
- **FHE Tutorial**: https://docs.zama.ai/protocol/solidity-guides/
- **Community Forum**: https://community.zama.ai/
- **Discord**: https://discord.com/invite/zama
- **GitHub**: https://github.com/zama-ai

---

## Support

For issues:
1. Check this guide first
2. Search Zama community forum
3. Create GitHub issue with details
4. Ask in Discord #support channel
