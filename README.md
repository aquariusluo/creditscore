# Private Credit Score Assessment 🔐

A privacy-preserving credit score calculation system using **Zama's Fully Homomorphic Encryption (FHE)**.

## Overview

This application allows users to:
- **Submit encrypted credit data** (income, assets, credit history) without revealing raw values
- **Calculate weighted credit scores** entirely on encrypted data
- **Decrypt only their own score** while maintaining complete privacy

### Key Features

✅ **Complete Privacy**: All data remains encrypted during computation
✅ **Weighted Calculation**: Income (50%) + Assets (30%) + History (20%)
✅ **User Control**: Only the user can decrypt their own score
✅ **On-Chain Computation**: All calculations happen transparently on-chain
✅ **Scalable**: Supports unlimited users without privacy leaks

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                           │
│              (React + Web3 Frontend)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Encrypted Data
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Smart Contract (Solidity)                       │
│         PrivateCreditScore.sol                              │
├─────────────────────────────────────────────────────────────┤
│ 1. submitCreditData() - Store encrypted inputs              │
│ 2. computeCreditScore() - Calculate on encrypted data       │
│ 3. revealMyScore() - Decrypt only own result              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ FHE Operations
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         Zama TFHE Library (fhevm)                           │
│  Encrypted Arithmetic & Comparison Operations              │
└─────────────────────────────────────────────────────────────┘
```

## Formula

```
Credit Score = (income × 0.5 + assets × 0.3 + history × 0.2) / 100
```

**Weights:**
- Income contribution: 50%
- Assets contribution: 30%
- Credit history: 20%

## File Structure

```
creditscore/
├── contracts/
│   └── CreditScore.sol          # Main smart contract with FHE logic
├── frontend/
│   ├── src/
│   │   ├── CreditScoreApp.jsx   # React component
│   │   └── CreditScoreApp.css   # Styling
│   └── package.json
├── test/
│   └── CreditScore.t.sol        # Forge tests
├── hardhat.config.ts            # Hardhat configuration
├── package.json                 # Project dependencies
└── README.md                     # This file
```

## Smart Contract Overview

### PrivateCreditScore.sol

**Key Functions:**

1. **submitCreditData()**
   - Input: Three encrypted values (income, assets, history)
   - Validates ranges in encrypted form
   - Stores data in mapping: `creditDataMap[user]`

2. **computeCreditScore(user)**
   - Performs weighted calculation on encrypted values
   - All arithmetic is in encrypted domain
   - Stores result in `encryptedScores[user]`
   - Emits `ScoreComputed` event

3. **revealMyScore(signature)**
   - Decrypts user's computed score
   - Returns plaintext result (0-1000)
   - Only the user can decrypt with their key
   - Emits `ScoreRevealed` event

**Data Structures:**

```solidity
struct CreditData {
    euint32 income;      // Encrypted
    euint32 assets;      // Encrypted
    euint32 history;     // Encrypted
    uint64 timestamp;
    bool exists;
}

mapping(address => CreditData) creditDataMap;
mapping(address => euint32) encryptedScores;
```

## Frontend Features

### React Component (CreditScoreApp.jsx)

**User Journey:**

1. **Connect Wallet** - MetaMask integration
2. **Submit Data** - Three encrypted inputs with validation
3. **Verify Submission** - Confirmation on blockchain
4. **Compute Score** - Trigger calculation on encrypted data
5. **Reveal Score** - Decrypt and display result

**Validation:**
- Income: 0 - 1,000,000 (thousands)
- Assets: 0 - 10,000,000 (thousands)
- History: 0 - 100 (score)

## Setup Instructions

### Prerequisites

```bash
# Required
- Node.js (v16+)
- MetaMask or compatible wallet
- Hardhat
- Zama fhevm library
```

### Installation

```bash
# 1. Install backend dependencies
npm install

# 2. Install frontend dependencies
npm run frontend:install

# 3. Create .env file
cat > .env << EOF
PRIVATE_KEY=your_private_key_here
RPC_URL=https://your-fheevm-testnet-rpc
REACT_APP_RPC_URL=https://your-fheevm-testnet-rpc
REACT_APP_CONTRACT_ADDRESS=deployed_contract_address
EOF
```

### Compilation

```bash
# Compile smart contract
npm run build

# Run tests
npm run test

# Deploy to testnet
npm run deploy:testnet
```

### Frontend

```bash
# Start React development server
npm run frontend:start

# Build for production
npm run frontend:build
```

## Usage Example

### 1. Submit Credit Data

```javascript
// User data (plaintext, will be encrypted by SDK)
const data = {
  income: 150,      // $150,000
  assets: 500,      // $500,000
  history: 85       // 85/100 credit score
};

// Frontend encrypts before sending
const encryptedIncome = await fheClient.encrypt32(data.income);
const encryptedAssets = await fheClient.encrypt32(data.assets);
const encryptedHistory = await fheClient.encrypt32(data.history);

// Submit to contract
await creditScore.submitCreditData(
  encryptedIncome,
  encryptedAssets,
  encryptedHistory
);
```

### 2. Compute Score

```javascript
// All computation happens on encrypted data
const tx = await creditScore.computeMyScore();
await tx.wait();

// Score is now stored encrypted: (150 × 0.5 + 500 × 0.3 + 85 × 0.2) / 100
// = (75 + 150 + 17) / 100 = 242 (when decrypted)
```

### 3. Reveal Score

```javascript
// Only the user can decrypt their own score
const decryptedScore = await creditScore.revealMyScore(signature);
console.log("Your private credit score:", decryptedScore);
// Output: 242
```

## Security Features

### 🔐 Privacy Guarantees

1. **Input Encryption**: All data encrypted before submission
2. **Encrypted Computation**: Smart contract never sees plaintext
3. **User-Controlled Decryption**: Only user can decrypt their score
4. **Range Validation**: Constraints checked on encrypted data
5. **No Leakage**: Intermediate results never decrypted

### 🛡️ Smart Contract Security

- Input validation in encrypted form
- Access control via sender address
- Timestamp tracking for audit
- Event logging for transparency
- No access to plaintext values

## Testing

```bash
# Run all tests
npm run test

# Test categories:
# - Data submission and storage
# - Multi-user isolation
# - Privacy preservation
# - Weight calculations
# - Score computations
# - Access control
# - Input validation
# - Score bounds
# - Timestamp tracking
# - Multiple submissions
```

## Gas Estimation

**Operations (approximate on Zama Testnet):**

| Operation | Gas | Notes |
|-----------|-----|-------|
| Submit Credit Data | 150,000 | Encrypts and stores 3 values |
| Compute Score | 200,000 | FHE arithmetic operations |
| Reveal Score | 50,000 | Decryption and event |

## Limitations & Future Improvements

### Current Limitations
- Scores capped at 1000
- Fixed weights (not dynamic)
- Single-user decryption only
- Linear calculation only

### Future Enhancements
- [ ] Authorized third-party validators
- [ ] Dynamic weight adjustment
- [ ] Batch score computation
- [ ] Advanced ML models on encrypted data
- [ ] Historical score tracking
- [ ] Cross-chain integration
- [ ] DAO governance for parameters

## Privacy Analysis

### What remains private:
✅ Raw income values
✅ Total asset values
✅ Credit history data
✅ Weighted contributions
✅ Final computed score (to others)

### What's public:
- User addresses (transparent to blockchain)
- Submission timestamps
- Score computation status
- Encrypted data (computationally infeasible to decrypt without key)

## References

- **Zama FHE Framework**: https://docs.zama.ai/
- **TFHE-rs**: https://docs.zama.ai/tfhe-rs
- **fhevm Library**: https://docs.zama.ai/protocol/
- **Solidity Guides**: https://docs.zama.ai/protocol/solidity-guides/

## License

MIT

## Support

For issues, questions, or contributions:
- Zama Community Forum: https://community.zama.ai/
- Discord: https://discord.com/invite/zama
- Telegram: https://t.me/+Ojt5y-I7oR42MTkx

---

**🔒 Built with Zama FHE | Privacy-First Credit Assessment**
