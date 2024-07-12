# Deployment Guide

## Prerequisites

- Node.js 18+
- Hardhat
- Ethereum wallet with ETH for gas
- Etherscan API key (for verification)

## Environment Setup

1. Copy environment file:
```bash
cp .env.example .env
```

2. Configure `.env`:
```
SEPOLIA_RPC_URL=your_rpc_url
MAINNET_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_api_key
```

## Local Development

### Start Local Node

```bash
npm run node
```

### Deploy to Local Network

```bash
npm run deploy
```

### Seed Test Data

```bash
npm run seed
```

## Testnet Deployment (Sepolia)

### 1. Deploy Contracts

```bash
npm run deploy:sepolia
```

### 2. Verify Contracts

```bash
npm run verify
```

### 3. Configure Frontend

Update `frontend/.env.local` with contract addresses from `deployment.json`

## Mainnet Deployment

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Gas optimization reviewed
- [ ] Emergency procedures documented
- [ ] Multi-sig wallets setup
- [ ] Sufficient ETH for deployment

### Deployment Steps

1. **Deploy Core Contracts**
```bash
hardhat run scripts/deploy.js --network mainnet
```

2. **Verify on Etherscan**
```bash
hardhat run scripts/verify.js --network mainnet
```

3. **Setup Governance**
   - Grant roles to multi-sig
   - Set approval thresholds
   - Configure timelock delays

4. **Initialize System**
   - Distribute initial tokens
   - Register founding members
   - Create genesis proposals

### Post-Deployment

1. **Security**
   - Transfer ownership to multi-sig
   - Renounce deployer privileges
   - Enable monitoring

2. **Documentation**
   - Update contract addresses
   - Publish ABIs
   - Update frontend

3. **Announcement**
   - Discord/Twitter announcement
   - Update website
   - Notify community

## Contract Addresses

Contract addresses are generated during deployment and saved in `deployment.json`.

### Mainnet
Mainnet deployment will occur after security audit completion.

### Sepolia Testnet
Deploy to Sepolia testnet for testing:
```bash
npm run deploy:sepolia
```

Check `deployment.json` for actual addresses after deployment.

Example address format:
- OrionToken: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
- ProposalNFT: `0x0165878A594ca255338adfa4d48449f69242Eb8F`
- QuadraticVoting: `0xa513E6E4b8f2a923D98304ec87F64353C4D5C853`
- ReputationManager: `0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6`
- Treasury: `0x8A791620dd6260079BF849Dc5567aDC3F2FdC318`
- DAORegistry: `0x610178dA211FEF7D417bC0e6FeD39F05609AD788`

## Troubleshooting

### Gas Estimation Failed
- Increase gas limit
- Check contract logic
- Verify network connection

### Transaction Reverted
- Check error message
- Verify permissions
- Ensure sufficient balance

### Verification Failed
- Wait for block confirmations
- Check constructor arguments
- Verify network selection

## Rollback Procedure

In case of critical issues:

1. Pause contracts (if pausable)
2. Notify users immediately
3. Investigate root cause
4. Deploy fix
5. Resume operations
6. Post-mortem analysis

## Monitoring

### Metrics to Track
- Transaction volume
- Active users
- Proposal count
- Voting participation
- Treasury balance
- Gas costs

### Tools
- Etherscan
- Dune Analytics
- TheGraph
- Custom dashboards

## Support

For deployment assistance:
- Discord: #dev-support
- Email: dev@oriondao.io
- Documentation: docs.oriondao.io

