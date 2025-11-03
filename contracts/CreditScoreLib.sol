// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title CreditScoreLib
 * @notice Library for credit score calculations and utilities
 */
library CreditScoreLib {
    // Constants for calculation
    uint8 public constant INCOME_WEIGHT = 50;
    uint8 public constant ASSETS_WEIGHT = 30;
    uint8 public constant HISTORY_WEIGHT = 20;
    uint8 public constant WEIGHT_DIVISOR = 100;

    // Score thresholds
    uint32 public constant MIN_SCORE = 0;
    uint32 public constant MAX_SCORE = 1000;
    uint32 public constant EXCELLENT_THRESHOLD = 750;
    uint32 public constant GOOD_THRESHOLD = 650;

    /**
     * @notice Calculate score rating based on numeric score
     */
    enum ScoreRating {
        POOR,           // < 650
        GOOD,           // 650-749
        EXCELLENT       // >= 750
    }

    /**
     * @notice Get rating for a given score
     */
    function getScoreRating(uint32 score) internal pure returns (ScoreRating) {
        if (score >= EXCELLENT_THRESHOLD) {
            return ScoreRating.EXCELLENT;
        } else if (score >= GOOD_THRESHOLD) {
            return ScoreRating.GOOD;
        } else {
            return ScoreRating.POOR;
        }
    }

    /**
     * @notice Get rating description
     */
    function getRatingDescription(ScoreRating rating)
        internal
        pure
        returns (string memory)
    {
        if (rating == ScoreRating.EXCELLENT) {
            return "Excellent";
        } else if (rating == ScoreRating.GOOD) {
            return "Good";
        } else {
            return "Needs Improvement";
        }
    }
}
