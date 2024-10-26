# Troubleshooting Guide

## Common Issues

### Installation Problems

#### npm install fails
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### Compilation errors
```bash
# Clean and recompile
npm run clean
npm run compile
```

### Contract Deployment

#### Insufficient funds
Ensure your deployment wallet has enough ETH for gas fees.

#### Network connection timeout
Check RPC URL in .env file and network connection.

### Frontend Issues

#### Wallet not connecting
- Ensure MetaMask is installed
- Check network settings
- Clear browser cache

#### Contract address not found
- Verify deployment.json exists
- Update contract addresses in .env

### Test Failures

#### Timeout errors
Increase mocha timeout in hardhat.config.js:
```javascript
mocha: {
  timeout: 100000
}
```

#### State errors
Ensure proper test isolation with beforeEach hooks.

## Getting Help

1. Check [FAQ](FAQ.md)
2. Search [GitHub Issues](https://github.com/Girishktas/OrionDAO/issues)
3. Ask in [Discord](https://discord.gg/oriondao)
4. Email: support@oriondao.io

## Reporting Bugs

Include:
- Operating system
- Node.js version
- Error messages
- Steps to reproduce

