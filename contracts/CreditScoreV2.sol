// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";
import "./CreditScoreLib.sol";

/**
 * @title PrivateCreditScoreV2
 * @notice Enhanced version with validator support and advanced features
 * @dev Allows authorized validators to view scores while maintaining user privacy
 */
contract PrivateCreditScoreV2 is EIP712WithModifier {
    using CreditScoreLib for CreditScoreLib.ScoreRating;

    // Constants
    uint8 private constant INCOME_WEIGHT = 50;
    uint8 private constant ASSETS_WEIGHT = 30;
    uint8 private constant HISTORY_WEIGHT = 20;

    // Validator role
    mapping(address => bool) public authorizedValidators;
    address public owner;

    // Credit data
    struct CreditData {
        euint32 income;
        euint32 assets;
        euint32 history;
        uint64 timestamp;
        bool exists;
    }

    // Score data with metadata
    struct ScoreData {
        euint32 encryptedScore;
        uint32 decryptedScore;
        bool isDecrypted;
        uint64 computeTime;
    }

    mapping(address => CreditData) public creditDataMap;
    mapping(address => ScoreData) public scoreDataMap;
    mapping(address => mapping(address => bool)) public validatorAccess;

    // Events
    event CreditDataSubmitted(address indexed user, uint64 timestamp);
    event ScoreComputed(address indexed user, uint64 timestamp);
    event ScoreRevealed(address indexed user, uint32 revealedScore);
    event ValidatorAuthorized(address indexed validator);
    event ValidatorRevoked(address indexed validator);
    event ValidatorAccessGranted(address indexed user, address indexed validator);
    event ValidatorAccessRevoked(address indexed user, address indexed validator);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyValidator() {
        require(authorizedValidators[msg.sender], "Not authorized validator");
        _;
    }

    constructor() EIP712WithModifier() {
        owner = msg.sender;
    }

    /**
     * @notice Add authorized validator
     */
    function addValidator(address validator) public onlyOwner {
        authorizedValidators[validator] = true;
        emit ValidatorAuthorized(validator);
    }

    /**
     * @notice Revoke validator authorization
     */
    function revokeValidator(address validator) public onlyOwner {
        authorizedValidators[validator] = false;
        emit ValidatorRevoked(validator);
    }

    /**
     * @notice Grant validator access to user's score
     */
    function grantValidatorAccess(address validator) public {
        require(authorizedValidators[validator], "Not a validator");
        validatorAccess[msg.sender][validator] = true;
        emit ValidatorAccessGranted(msg.sender, validator);
    }

    /**
     * @notice Revoke validator access
     */
    function revokeValidatorAccess(address validator) public {
        validatorAccess[msg.sender][validator] = false;
        emit ValidatorAccessRevoked(msg.sender, validator);
    }

    /**
     * @notice Submit encrypted credit data
     */
    function submitCreditData(
        einput encryptedIncome,
        einput encryptedAssets,
        einput encryptedHistory
    ) public {
        euint32 income = TFHE.asEuint32(encryptedIncome);
        euint32 assets = TFHE.asEuint32(encryptedAssets);
        euint32 history = TFHE.asEuint32(encryptedHistory);

        // Validate ranges
        euint32 maxIncome = TFHE.asEuint32(1000000);
        TFHE.req(TFHE.le(income, maxIncome));

        euint32 maxAssets = TFHE.asEuint32(10000000);
        TFHE.req(TFHE.le(assets, maxAssets));

        euint32 maxHistory = TFHE.asEuint32(100);
        TFHE.req(TFHE.le(history, maxHistory));

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
     * @notice Compute credit score for user
     */
    function computeCreditScore(address user) public returns (euint32) {
        require(creditDataMap[user].exists, "No credit data");

        CreditData storage data = creditDataMap[user];

        euint32 incomePart = TFHE.mul(data.income, INCOME_WEIGHT);
        euint32 assetsPart = TFHE.mul(data.assets, ASSETS_WEIGHT);
        euint32 historyPart = TFHE.mul(data.history, HISTORY_WEIGHT);

        euint32 totalScore = TFHE.add(incomePart, assetsPart);
        totalScore = TFHE.add(totalScore, historyPart);

        euint32 divisor = TFHE.asEuint32(100);
        euint32 finalScore = TFHE.div(totalScore, divisor);

        euint32 maxScore = TFHE.asEuint32(1000);
        euint32 cappedScore = TFHE.min(finalScore, maxScore);

        scoreDataMap[user].encryptedScore = cappedScore;
        scoreDataMap[user].computeTime = uint64(block.timestamp);

        emit ScoreComputed(user, uint64(block.timestamp));

        return cappedScore;
    }

    /**
     * @notice Compute own score
     */
    function computeMyScore() public returns (euint32) {
        return computeCreditScore(msg.sender);
    }

    /**
     * @notice Reveal own score
     */
    function revealMyScore(bytes calldata signature) public returns (uint32) {
        euint32 encryptedScore = scoreDataMap[msg.sender].encryptedScore;
        uint32 decryptedScore = TFHE.decrypt(encryptedScore);

        scoreDataMap[msg.sender].decryptedScore = decryptedScore;
        scoreDataMap[msg.sender].isDecrypted = true;

        emit ScoreRevealed(msg.sender, decryptedScore);

        return decryptedScore;
    }

    /**
     * @notice Validator view authorized user's score
     */
    function viewAuthorizedScore(address user) public view onlyValidator returns (uint32) {
        require(validatorAccess[user][msg.sender], "Not authorized");
        require(scoreDataMap[user].isDecrypted, "Score not decrypted");
        return scoreDataMap[user].decryptedScore;
    }

    /**
     * @notice Get user's score rating
     */
    function getScoreRating(address user)
        public
        view
        returns (string memory)
    {
        require(scoreDataMap[user].isDecrypted, "Score not decrypted");

        uint32 score = scoreDataMap[user].decryptedScore;
        CreditScoreLib.ScoreRating rating;

        if (score >= CreditScoreLib.EXCELLENT_THRESHOLD) {
            rating = CreditScoreLib.ScoreRating.EXCELLENT;
        } else if (score >= CreditScoreLib.GOOD_THRESHOLD) {
            rating = CreditScoreLib.ScoreRating.GOOD;
        } else {
            rating = CreditScoreLib.ScoreRating.POOR;
        }

        return CreditScoreLib.getRatingDescription(rating);
    }

    /**
     * @notice Check if user has submitted data
     */
    function hasSubmittedData(address user) public view returns (bool) {
        return creditDataMap[user].exists;
    }

    /**
     * @notice Check if score has been computed
     */
    function hasComputedScore(address user) public view returns (bool) {
        return scoreDataMap[user].computeTime > 0;
    }

    /**
     * @notice Check if score has been decrypted
     */
    function isScoreDecrypted(address user) public view returns (bool) {
        return scoreDataMap[user].isDecrypted;
    }

    /**
     * @notice Get user's score if decrypted (public view)
     */
    function getMyScore() public view returns (uint32) {
        require(scoreDataMap[msg.sender].isDecrypted, "Score not decrypted");
        return scoreDataMap[msg.sender].decryptedScore;
    }
}
