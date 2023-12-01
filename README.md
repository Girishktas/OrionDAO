# OrionDAO - Progressive Consensus Governance System

OrionDAO is a decentralized autonomous organization (DAO) governance framework built on Ethereum, featuring Quadratic Voting and Reputation-weighted mechanisms for fair, efficient, and transparent decision-making.

## Overview

OrionDAO implements a progressive consensus system that manages proposals through a complete lifecycle from draft to execution, ensuring democratic and secure governance for decentralized communities.

## Key Features

- **Quadratic Voting**: Prevents whale manipulation through quadratic cost curves
- **Reputation System**: Dynamic weight calculation based on participation and contribution
- **Automated Execution**: Self-executing proposals with timelock security
- **Treasury Management**: Multi-signature with delay mechanism for fund safety
- **NFT Proposals**: Unique proposal identification using ERC-721 tokens
- **On-chain Transparency**: All governance actions recorded immutably

## Architecture

```
[DAO Members]
   │
   ├─→ [ProposalNFT.sol] → Proposal creation and tracking
   ├─→ [QuadraticVoting.sol] → Voting logic execution
   ├─→ [ReputationManager.sol] → Reputation synchronization
   ├─→ [Treasury.sol] → Fund custody and execution
   └─→ [Frontend Dashboard] → Visualization and governance operations
```

## Technology Stack

- **Smart Contracts**: Solidity + Hardhat + OpenZeppelin
- **Storage & Indexing**: IPFS + TheGraph
- **Frontend**: Next.js + wagmi + viem
- **Oracle**: Chainlink for reputation updates
- **Testing**: Hardhat + Chai

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- MetaMask or compatible wallet

### Installation

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test

# Start local node
npm run node

# Deploy contracts
npm run deploy
```

## Core Contracts

- **ProposalNFT.sol**: Unique proposal identification (ERC-721)
- **QuadraticVoting.sol**: Quadratic voting logic with token locking
- **ReputationManager.sol**: Reputation scoring and weight calculation
- **Treasury.sol**: Fund management with multisig + timelock
- **DAORegistry.sol**: Member registration and permission control

## Security

- Anti-manipulation through vote locking and quadratic curves
- Multi-signature requirements for critical operations
- 48-hour timelock delay for proposal execution
- EIP-712 signature verification
- Comprehensive test coverage

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## Contact

For questions and support, please open an issue on GitHub.

