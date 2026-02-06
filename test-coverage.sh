#!/bin/bash
# Script to run tests and generate coverage report

echo "Running tests..."
npx hardhat test

echo ""
echo "Generating coverage report..."
npx hardhat coverage --network localhost

echo ""
echo "Coverage report generated!"
