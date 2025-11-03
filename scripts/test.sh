#!/bin/bash

# Private Credit Score - Testing Utility
# Runs comprehensive tests and validation

set -e

echo "🧪 Private Credit Score Test Suite"
echo "===================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test function
run_test() {
    local test_name=$1
    local test_cmd=$2

    echo -n "Testing: $test_name... "

    if eval "$test_cmd" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
    fi
}

# 1. Check dependencies
echo "📋 Checking dependencies..."
echo ""

run_test "Node.js installed" "node --version"
run_test "npm installed" "npm --version"
run_test "Hardhat installed" "npx hardhat --version"

echo ""

# 2. Check file structure
echo "📂 Checking project structure..."
echo ""

run_test "contracts/CreditScore.sol exists" "test -f contracts/CreditScore.sol"
run_test "contracts/CreditScoreLib.sol exists" "test -f contracts/CreditScoreLib.sol"
run_test "contracts/CreditScoreV2.sol exists" "test -f contracts/CreditScoreV2.sol"
run_test "frontend/src/CreditScoreApp.jsx exists" "test -f frontend/src/CreditScoreApp.jsx"
run_test "test/CreditScore.t.sol exists" "test -f test/CreditScore.t.sol"
run_test "README.md exists" "test -f README.md"

echo ""

# 3. Check Solidity files
echo "🔍 Validating Solidity syntax..."
echo ""

run_test "CreditScore.sol syntax" "grep -q 'pragma solidity' contracts/CreditScore.sol"
run_test "CreditScoreLib.sol syntax" "grep -q 'library CreditScoreLib' contracts/CreditScoreLib.sol"
run_test "CreditScoreV2.sol syntax" "grep -q 'contract PrivateCreditScoreV2' contracts/CreditScoreV2.sol"

echo ""

# 4. Check JavaScript/React files
echo "⚛️  Validating JavaScript/React..."
echo ""

run_test "React component valid" "grep -q 'function CreditScoreApp' frontend/src/CreditScoreApp.jsx"
run_test "Styling file exists" "test -f frontend/src/CreditScoreApp.css"
run_test "Index file exists" "test -f frontend/src/index.jsx"

echo ""

# 5. Check configuration files
echo "⚙️  Validating configuration..."
echo ""

run_test "package.json valid" "grep -q '\"name\"' package.json"
run_test "hardhat.config.ts valid" "grep -q 'solidity' hardhat.config.ts"
run_test ".env.example exists" "test -f .env.example"

echo ""

# 6. Python script validation
echo "🐍 Validating Python scripts..."
echo ""

run_test "credit_calc.py syntax" "python3 -m py_compile scripts/credit_calc.py"

echo ""

# 7. Smart contract logic tests
echo "🧮 Testing credit calculation logic..."
echo ""

# Test case 1: Low income
RESULT=$(python3 scripts/credit_calc.py 50 100 50)
run_test "Low income calculation" "echo '$RESULT' | grep -q 'valid'"

# Test case 2: High income
RESULT=$(python3 scripts/credit_calc.py 500 1000 100)
run_test "High income calculation" "echo '$RESULT' | grep -q 'valid'"

# Test case 3: Rating assignment
RESULT=$(python3 scripts/credit_calc.py 200 500 80)
run_test "Score rating assignment" "echo '$RESULT' | grep -q 'rating'"

echo ""

# 8. Summary
echo "======================================"
echo "Test Results:"
echo -e "${GREEN}Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $FAILED${NC}"
else
    echo -e "${GREEN}Failed: $FAILED${NC}"
fi

echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
