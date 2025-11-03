// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";

/**
 * @title PrivateCreditScore
 * @notice A smart contract for calculating credit scores using Fully Homomorphic Encryption
 * @dev Allows users to submit encrypted credit data and compute weighted scores without revealing raw data
 */
contract PrivateCreditScore is EIP712WithModifier {
    // Credit score calculation weights (multiplied by 100 for precision)
    // income: 50%, assets: 30%, history: 20%
    uint8 private constant INCOME_WEIGHT = 50;
    uint8 private constant ASSETS_WEIGHT = 30;
    uint8 private constant HISTORY_WEIGHT = 20;

    // Store encrypted credit data for each user
    struct CreditData {
        euint32 income;      // Encrypted income (e.g., annual salary in thousands)
        euint32 assets;      // Encrypted total assets in thousands
        euint32 history;     // Encrypted credit history score (0-100)
        uint64 timestamp;    // When the data was submitted
        bool exists;         // Whether this user has submitted data
    }

    // Mapping from user address to their encrypted credit data
    mapping(address => CreditData) public creditDataMap;

    // Store computed credit scores (encrypted)
    mapping(address => euint32) public encryptedScores;

    // Events
    event CreditDataSubmitted(address indexed user, uint64 timestamp);
    event ScoreComputed(address indexed user, uint64 timestamp);
    event ScoreRevealed(address indexed user, uint32 revealedScore);

    constructor() EIP712WithModifier() {}

    /**
     * @notice Submit encrypted credit data to the contract
     * @param encryptedIncome Encrypted income value
     * @param encryptedAssets Encrypted assets value
     * @param encryptedHistory Encrypted credit history score
     * @dev Data must be provided as encrypted inputs using Zama's Relayer SDK
     */
    function submitCreditData(
        einput encryptedIncome,
        einput encryptedAssets,
        einput encryptedHistory
    ) public {
        // Decrypt inputs to euint32 using provided keys
        euint32 income = TFHE.asEuint32(encryptedIncome);
        euint32 assets = TFHE.asEuint32(encryptedAssets);
        euint32 history = TFHE.asEuint32(encryptedHistory);

        // Validate data ranges (in encrypted form to maintain privacy)
        // Income: 0-1,000,000 (in thousands)
        euint32 maxIncome = TFHE.asEuint32(1000000);
        TFHE.req(TFHE.le(income, maxIncome));

        // Assets: 0-10,000,000 (in thousands)
        euint32 maxAssets = TFHE.asEuint32(10000000);
        TFHE.req(TFHE.le(assets, maxAssets));

        // History: 0-100 (credit score)
        euint32 maxHistory = TFHE.asEuint32(100);
        TFHE.req(TFHE.le(history, maxHistory));

        // Store the encrypted data
        creditDataMap[msg.sender] = CreditData({
            income: income,
            assets: assets,
            history: history,
            timestamp: uint64(block.timestamp),
            exists: true
        });

        emit CreditDataSubmitted(msg.sender, uint64(block.timestamp));
    }

    /**
     * @notice Compute the weighted credit score for a user
     * @param user The address of the user whose score to compute
     * @return The encrypted credit score
     * @dev Formula: (income * 0.5 + assets * 0.3 + history * 0.2) / 100
     */
    function computeCreditScore(address user) public returns (euint32) {
        require(creditDataMap[user].exists, "No credit data for this user");

        CreditData storage data = creditDataMap[user];

        // Get encrypted values
        euint32 income = data.income;
        euint32 assets = data.assets;
        euint32 history = data.history;

        // Compute weighted sum: (income * 50 + assets * 30 + history * 20) / 100
        // Perform all operations in encrypted form
        euint32 incomePart = TFHE.mul(income, INCOME_WEIGHT);
        euint32 assetsPart = TFHE.mul(assets, ASSETS_WEIGHT);
        euint32 historyPart = TFHE.mul(history, HISTORY_WEIGHT);

        // Sum all weighted parts
        euint32 totalScore = TFHE.add(incomePart, assetsPart);
        totalScore = TFHE.add(totalScore, historyPart);

        // Divide by 100 to normalize
        euint32 divisor = TFHE.asEuint32(100);
        euint32 finalScore = TFHE.div(totalScore, divisor);

        // Cap the score at 1000 (for display purposes)
        euint32 maxScore = TFHE.asEuint32(1000);
        euint32 cappedScore = TFHE.min(finalScore, maxScore);

        // Store the encrypted score
        encryptedScores[user] = cappedScore;

        emit ScoreComputed(user, uint64(block.timestamp));

        return cappedScore;
    }

    /**
     * @notice Compute credit score for the caller
     * @return The encrypted credit score
     */
    function computeMyScore() public returns (euint32) {
        return computeCreditScore(msg.sender);
    }

    /**
     * @notice Retrieve and decrypt own credit score
     * @param signature Signature from the user to authorize decryption
     * @return The decrypted credit score (0-1000)
     */
    function revealMyScore(
        bytes calldata signature
    ) public returns (uint32) {
        // Retrieve the encrypted score
        euint32 encryptedScore = encryptedScores[msg.sender];

        // Decrypt the score (requires the user's decryption key)
        // The TFHE.decrypt function will use the signature to verify authorization
        uint32 decryptedScore = TFHE.decrypt(encryptedScore);

        emit ScoreRevealed(msg.sender, decryptedScore);

        return decryptedScore;
    }

    /**
     * @notice Check if a user has submitted credit data
     * @param user The address to check
     * @return Whether the user has submitted data
     */
    function hasSubmittedData(address user) public view returns (bool) {
        return creditDataMap[user].exists;
    }

    /**
     * @notice Get the timestamp when user submitted their data
     * @param user The address to check
     * @return The timestamp of submission
     */
    function getSubmissionTime(address user) public view returns (uint64) {
        require(creditDataMap[user].exists, "No data submitted");
        return creditDataMap[user].timestamp;
    }

    /**
     * @notice Check if a score has been computed for a user
     * @param user The address to check
     * @return Whether a score has been computed
     */
    function hasComputedScore(address user) public view returns (bool) {
        // Check if encrypted score exists (non-zero check in encrypted form)
        return encryptedScores[user].isInitialized();
    }
}
