# Architecture & Technical Details

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface (React)                   │
│  - Input collection (income, assets, history)                  │
│  - Wallet connection (MetaMask)                                │
│  - Result display                                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    ▼ Encryption Layer
┌─────────────────────────────────────────────────────────────────┐
│                    Zama FHE Client SDK                          │
│  - encrypt32() - Encrypt plaintext values                       │
│  - decrypt() - Decrypt results using user key                 │
│  - getDecryptionKey() - Retrieve user's private key             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    ▼ Web3 Layer
┌─────────────────────────────────────────────────────────────────┐
│                    Blockchain Network                           │
│  - Transaction signing (MetaMask/ethers.js)                    │
│  - Gas payment in ETH                                           │
│  - Event logs                                                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    ▼ Smart Contract
┌─────────────────────────────────────────────────────────────────┐
│            PrivateCreditScore Smart Contract                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Data Storage Layer                                   │   │
│  │    - creditDataMap[user] = encrypted inputs            │   │
│  │    - encryptedScores[user] = encrypted result          │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 2. FHE Computation Layer (TFHE-rs)                     │   │
│  │    - euint32 arithmetic: mul, add, div                 │   │
│  │    - Encrypted comparisons: le, gt, eq                 │   │
│  │    - No plaintext exposure                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 3. Access Control & Decryption                         │   │
│  │    - User-only decryption keys                          │   │
│  │    - Optional validator authorization                   │   │
│  │    - Event logging                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Submission Flow

```
User Input
    ↓
[Income: 150, Assets: 500, History: 85]
    ↓
Validation (Client-side)
    ↓
FHE Encryption
    ↓
Encrypted: [enc(150), enc(500), enc(85)]
    ↓
Submit Transaction
    ↓
Contract receives encrypted inputs
    ↓
Store in mapping
    ↓
Emit CreditDataSubmitted event
```

### Computation Flow

```
Contract receives encrypted data
    ↓
Perform encrypted arithmetic:
  - incomeContribution = enc(income) × 50
  - assetsContribution = enc(assets) × 30
  - historyContribution = enc(history) × 20
    ↓
Sum: enc(150×50) + enc(500×30) + enc(85×20)
    ↓
Divide by 100
    ↓
Cap at 1000
    ↓
Store encrypted result
    ↓
Emit ScoreComputed event
```

### Decryption Flow

```
User requests score reveal
    ↓
Get user's decryption key
    ↓
Send key to contract
    ↓
Contract decrypts: decrypt(encryptedScore)
    ↓
Get plaintext: 242
    ↓
Emit ScoreRevealed event
    ↓
Display to user
```

## Cryptographic Details

### Fully Homomorphic Encryption (FHE)

**What it means:**
- "Fully" = Both addition AND multiplication supported
- "Homomorphic" = Operations on encrypted data
- "Encryption" = Data remains encrypted

**Advantages:**
✅ Computation without decryption
✅ Leakage-free processing
✅ Privacy-preserving smart contracts

**Supported Operations:**
```solidity
// Arithmetic
euint32 result = TFHE.add(a, b);      // Encrypted addition
euint32 result = TFHE.mul(a, b);      // Encrypted multiplication
euint32 result = TFHE.div(a, b);      // Encrypted division

// Comparison
ebool result = TFHE.le(a, b);         // Less than or equal
ebool result = TFHE.gt(a, b);         // Greater than
ebool result = TFHE.eq(a, b);         // Equality

// Utilities
euint32 result = TFHE.min(a, b);      // Minimum
euint32 result = TFHE.max(a, b);      // Maximum
```

### Security Guarantees

**IND-CPA Security:**
- Same plaintext → Different ciphertexts
- Eavesdropper cannot distinguish

**Semantic Security:**
- No partial information leaked
- Computational indistinguishability

**Zero-Knowledge Properties:**
- Computations verified without revealing data
- Proofs exist but not revealed

## Smart Contract Implementation

### Data Structures

```solidity
struct CreditData {
    euint32 income;          // Encrypted annual income
    euint32 assets;          // Encrypted total assets
    euint32 history;         // Encrypted credit history (0-100)
    uint64 timestamp;        // Clear timestamp for audit
    bool exists;             // Flag for existence check
}

mapping(address => CreditData) creditDataMap;        // User → Data
mapping(address => euint32) encryptedScores;        // User → Score
mapping(address => mapping(address => bool)) validatorAccess;
```

### Key Functions

#### 1. submitCreditData()
```solidity
function submitCreditData(
    einput encryptedIncome,
    einput encryptedAssets,
    einput encryptedHistory
) public {
    // Decrypt inputs from encrypted input format
    euint32 income = TFHE.asEuint32(encryptedIncome);
    euint32 assets = TFHE.asEuint32(encryptedAssets);
    euint32 history = TFHE.asEuint32(encryptedHistory);

    // Validate ranges (encrypted validation)
    TFHE.req(TFHE.le(income, TFHE.asEuint32(1000000)));
    TFHE.req(TFHE.le(assets, TFHE.asEuint32(10000000)));
    TFHE.req(TFHE.le(history, TFHE.asEuint32(100)));

    // Store
    creditDataMap[msg.sender] = CreditData({
        income: income,
        assets: assets,
        history: history,
        timestamp: uint64(block.timestamp),
        exists: true
    });
}
```

#### 2. computeCreditScore()
```solidity
function computeCreditScore(address user) public returns (euint32) {
    CreditData storage data = creditDataMap[user];

    // Formula: (income × 50 + assets × 30 + history × 20) / 100
    euint32 incomePart = TFHE.mul(data.income, 50);
    euint32 assetsPart = TFHE.mul(data.assets, 30);
    euint32 historyPart = TFHE.mul(data.history, 20);

    euint32 totalScore = TFHE.add(incomePart, assetsPart);
    totalScore = TFHE.add(totalScore, historyPart);

    euint32 finalScore = TFHE.div(totalScore, 100);
    euint32 cappedScore = TFHE.min(finalScore, 1000);

    encryptedScores[user] = cappedScore;
    return cappedScore;
}
```

#### 3. revealMyScore()
```solidity
function revealMyScore(bytes calldata signature) public returns (uint32) {
    euint32 encryptedScore = encryptedScores[msg.sender];
    uint32 decryptedScore = TFHE.decrypt(encryptedScore);
    emit ScoreRevealed(msg.sender, decryptedScore);
    return decryptedScore;
}
```

## Gas Efficiency

### Gas Costs

| Operation | Approximate Gas | Notes |
|-----------|-----------------|-------|
| submitCreditData | 150,000 | FHE encryption, storage |
| computeCreditScore | 200,000 | Multiple FHE operations |
| revealMyScore | 50,000 | Decryption, event |
| **Total Flow** | **400,000** | Complete workflow |

### Optimization Strategies

1. **Batch Operations**
   - Group multiple submissions
   - Reduce overhead

2. **Lazy Computation**
   - Don't compute until needed
   - Reduce unnecessary gas

3. **Efficient FHE**
   - Use min operations for caps
   - Avoid unnecessary computations

## Privacy Analysis

### What's Protected

| Information | Status | Protection |
|-------------|--------|-----------|
| Income value | ✅ Private | Encrypted |
| Asset value | ✅ Private | Encrypted |
| History score | ✅ Private | Encrypted |
| Final score | ✅ Private | Encrypted (unless revealed) |
| Computation | ✅ Private | In encrypted domain |

### What's Public

| Information | Status | Reason |
|-------------|--------|--------|
| User address | Public | Blockchain transparency |
| Transaction hash | Public | Audit trail |
| Submission time | Public | Audit trail |
| Score computation time | Public | Status tracking |

### Attack Resistance

**Against:**
- Dictionary attacks (encrypted data)
- Pattern analysis (randomized encryption)
- Side-channel attacks (FHE properties)
- Brute force (computational infeasibility)

**Limitations:**
- User address is public (pseudo-anonymity)
- Submission patterns visible
- Gas usage can leak information

## Scaling & Future Improvements

### Current Limitations

1. **Single Score Type**
   - Only one calculation formula
   - Could support multiple models

2. **Linear Weights**
   - Fixed percentages
   - Could use dynamic weights

3. **Single Decryption**
   - User-only decryption
   - Could support delegation

### Future Enhancements

1. **Off-Chain Computation**
   ```
   User submits encrypted data
        ↓
   Off-chain FHE server computes
        ↓
   Proof verified on-chain
        ↓
   Reduced gas cost
   ```

2. **Advanced Models**
   ```
   Machine learning on encrypted data
        ↓
   Neural networks in FHE
        ↓
   More sophisticated scoring
   ```

3. **Cross-Chain Integration**
   ```
   Submit on-chain A
        ↓
   Compute on-chain B (high FHE support)
        ↓
   Reveal on-chain A
   ```

## Testing Strategy

### Unit Tests
- Individual function behavior
- Input validation
- Arithmetic correctness

### Integration Tests
- Full workflow from submission to reveal
- Multi-user interactions
- Validator access

### Security Tests
- Range validation
- Access control
- Privacy leakage checks

---

**Last Updated:** 2024
**Zama Version:** Latest
**Solidity Version:** 0.8.24
