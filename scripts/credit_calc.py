#!/usr/bin/env python3
"""
Private Credit Score - Encryption/Decryption Helper Utility
Helps with local testing and development
"""

import json
import sys
from typing import Tuple
from dataclasses import dataclass

@dataclass
class CreditInput:
    """Represents credit input data"""
    income: int
    assets: int
    history: int

    def validate(self) -> Tuple[bool, str]:
        """Validate input ranges"""
        if not (0 <= self.income <= 1000000):
            return False, "Income must be 0-1,000,000 (thousands)"
        if not (0 <= self.assets <= 10000000):
            return False, "Assets must be 0-10,000,000 (thousands)"
        if not (0 <= self.history <= 100):
            return False, "History must be 0-100"
        return True, "Valid"

    def calculate_score(self) -> int:
        """Calculate credit score (for testing purposes)"""
        weighted_sum = (
            self.income * 0.5 +
            self.assets * 0.3 +
            self.history * 0.2
        )
        score = int(weighted_sum / 100)
        return min(score, 1000)  # Cap at 1000

    def get_rating(self) -> str:
        """Get score rating"""
        score = self.calculate_score()
        if score >= 750:
            return "Excellent"
        elif score >= 650:
            return "Good"
        else:
            return "Needs Improvement"

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "income": self.income,
            "assets": self.assets,
            "history": self.history,
            "calculated_score": self.calculate_score(),
            "rating": self.get_rating()
        }


class CreditScoreCalculator:
    """Calculator for credit scores"""

    @staticmethod
    def calculate(income: int, assets: int, history: int) -> dict:
        """
        Calculate credit score from inputs

        Args:
            income: Annual income (thousands)
            assets: Total assets (thousands)
            history: Credit history (0-100)

        Returns:
            Dictionary with calculation details
        """
        credit = CreditInput(income=income, assets=assets, history=history)
        valid, message = credit.validate()

        if not valid:
            return {
                "error": message,
                "valid": False
            }

        score = credit.calculate_score()
        rating = credit.get_rating()

        return {
            "valid": True,
            "inputs": credit.to_dict(),
            "calculation": {
                "income_contribution": income * 0.5,
                "assets_contribution": assets * 0.3,
                "history_contribution": history * 0.2,
                "weighted_sum": income * 0.5 + assets * 0.3 + history * 0.2,
                "final_score": score
            },
            "rating": rating,
            "thresholds": {
                "excellent": ">= 750",
                "good": "650-749",
                "poor": "< 650"
            }
        }

    @staticmethod
    def batch_calculate(inputs: list) -> list:
        """Calculate scores for multiple inputs"""
        return [
            CreditScoreCalculator.calculate(
                inp["income"],
                inp["assets"],
                inp["history"]
            )
            for inp in inputs
        ]


def main():
    """CLI interface"""
    if len(sys.argv) < 2:
        print("Usage: python credit_calc.py <income> <assets> <history>")
        print("Example: python credit_calc.py 150 500 85")
        sys.exit(1)

    try:
        income = int(sys.argv[1])
        assets = int(sys.argv[2])
        history = int(sys.argv[3])

        result = CreditScoreCalculator.calculate(income, assets, history)
        print(json.dumps(result, indent=2))

    except ValueError:
        print("Error: All inputs must be integers")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
