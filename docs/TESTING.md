# Testing Guide

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test File
```bash
npx hardhat test test/ProposalNFT.test.js
```

### With Gas Reporting
```bash
REPORT_GAS=true npm test
```

### Coverage Report
```bash
npm run coverage
```

## Test Structure

### Unit Tests
- ProposalNFT.test.js
- QuadraticVoting.test.js
- ReputationManager.test.js
- Treasury.test.js
- DAORegistry.test.js
- OrionToken.test.js

### Integration Tests
See `test/Integration.test.js` for comprehensive integration testing of contract interactions.

### End-to-End Tests
E2E tests will simulate complete user workflows from proposal creation to execution using Cypress.

## Writing Tests

### Test Template
```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContractName", function () {
  let contract;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("ContractName");
    contract = await Contract.deploy();
  });

  it("Should do something", async function () {
    // Test implementation
  });
});
```

## Best Practices

1. Test all public functions
2. Test edge cases
3. Test error conditions
4. Use descriptive test names
5. Maintain >90% coverage

## CI/CD

Tests run automatically on:
- Pull requests
- Pushes to main
- Scheduled daily runs

