# OrionDAO - Progressive Consensus Governance System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://github.com/Girishktas/OrionDAO/workflows/Test%20Suite/badge.svg)](https://github.com/Girishktas/OrionDAO/actions)

OrionDAO is a decentralized autonomous organization (DAO) governance framework built on Ethereum, featuring **Quadratic Voting** and **Reputation-weighted** mechanisms for fair, efficient, and transparent decision-making.

## 🌟 Key Features

- **Quadratic Voting**: Prevents whale manipulation through quadratic cost curves
- **Reputation System**: Dynamic weight calculation based on participation and contribution
- **Automated Execution**: Self-executing proposals with timelock security
- **Treasury Management**: Multi-signature with delay mechanism for fund safety
- **NFT Proposals**: Unique proposal identification using ERC-721 tokens
- **On-chain Transparency**: All governance actions recorded immutably

## 🏗️ Architecture

```
[DAO Members]
   │
   ├─→ [ProposalNFT.sol] → Proposal creation and tracking
   ├─→ [QuadraticVoting.sol] → Voting logic execution
   ├─→ [ReputationManager.sol] → Reputation synchronization
   ├─→ [Treasury.sol] → Fund custody and execution
   ├─→ [DAORegistry.sol] → Member management
   └─→ [Frontend Dashboard] → Visualization and operations
```

## 🛠️ Technology Stack

- **Smart Contracts**: Solidity + Hardhat + OpenZeppelin
- **Storage & Indexing**: IPFS + TheGraph
- **Frontend**: Next.js + wagmi + viem
- **Oracle**: Chainlink for reputation updates
- **Testing**: Hardhat + Chai

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet

### Installation

```bash
# Clone repository
git clone https://github.com/Girishktas/OrionDAO.git
cd OrionDAO

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env with your settings
```

### Development

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Start local blockchain
npm run node

# Deploy to local network (in another terminal)
npm run deploy

# Seed test data
npm run seed

# Start frontend
cd frontend
npm install
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run coverage

# Run specific test file
npx hardhat test test/ProposalNFT.test.js
```

## 📦 Core Contracts

### ProposalNFT.sol
Unique proposal identification using ERC-721. Each proposal is minted as a non-transferable NFT.

### QuadraticVoting.sol
Implements quadratic voting mechanism with token locking to prevent manipulation.

**Cost Formula**: `cost = votes² / (reputation / 100)`

### ReputationManager.sol
Manages member reputation scores based on participation, accuracy, and contribution.

**Components**:
- Participation (30%)
- Accuracy (40%)
- Contribution (30%)

### Treasury.sol
Secure fund management with multi-signature approval and 48-hour timelock.

**Features**:
- Multi-sig approval (default 3 signatures)
- Timelock delay (minimum 48 hours)
- Emergency withdrawal

### DAORegistry.sol
Member registration and role-based permission management.

**Roles**:
- Member (1)
- Contributor (2)
- Core (3)
- Admin (4)

### OrionToken.sol
ERC-20 governance token used for voting.

**Supply**:
- Initial: 100M tokens
- Maximum: 1B tokens

## 📚 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Governance Guide](docs/GOVERNANCE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security Policy](docs/SECURITY.md)

## 🔐 Security

- All contracts use OpenZeppelin libraries
- ReentrancyGuard on critical functions
- Role-based access control
- Comprehensive test coverage (>90%)
- Security audit: Pending

**Report vulnerabilities**: security@oriondao.io

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📊 Project Status

- ✅ Core contracts implemented
- ✅ Comprehensive test suite
- ✅ Frontend dashboard
- ✅ Documentation complete
- ⏳ Security audit
- ⏳ Mainnet deployment

## 🗺️ Roadmap

### Phase 1: Foundation (Q1 2024) ✅
- Core contract development
- Testing framework
- Documentation

### Phase 2: Integration (Q2 2024)
- Frontend development
- TheGraph subgraph
- Chainlink oracle integration

### Phase 3: Launch (Q3 2024)
- Security audit
- Testnet deployment
- Community building

### Phase 4: Mainnet (Q4 2024)
- Mainnet deployment
- Governance activation
- Cross-chain expansion

## 🌐 Community

- **Discord**: [Join our server](https://discord.gg/oriondao)
- **Twitter**: [@OrionDAO](https://twitter.com/oriondao)
- **Forum**: [forum.oriondao.io](https://forum.oriondao.io)
- **Documentation**: [docs.oriondao.io](https://docs.oriondao.io)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

OrionDAO is built by a distributed team of developers and governance enthusiasts committed to creating fair and transparent DAO infrastructure.

## 🙏 Acknowledgments

- OpenZeppelin for secure contract libraries
- Hardhat for development framework
- The Ethereum community for inspiration

## 📞 Contact

- Email: team@oriondao.io
- Discord: OrionDAO Server
- Twitter: @OrionDAO

---

**Built with ❤️ for the decentralized future**
