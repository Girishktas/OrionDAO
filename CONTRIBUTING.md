# Contributing to OrionDAO

Thank you for your interest in contributing to OrionDAO! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Create a new issue with detailed description
3. Include steps to reproduce
4. Specify your environment (OS, Node version, etc.)

### Suggesting Features

1. Open an issue describing the feature
2. Explain the use case and benefits
3. Discuss implementation approach
4. Wait for maintainer feedback

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Ensure all tests pass (`npm test`)
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

### Commit Messages

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions or modifications
- `refactor:` Code refactoring
- `style:` Formatting changes
- `chore:` Maintenance tasks

Example: `feat: add quadratic voting cost calculator`

## Development Setup

```bash
# Clone repository
git clone https://github.com/Girishktas/OrionDAO.git
cd OrionDAO

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test

# Start local blockchain
npm run node

# Deploy locally
npm run deploy
```

## Testing

- Write tests for all new features
- Maintain >90% code coverage
- Test edge cases and error conditions
- Use descriptive test names

## Code Style

- Follow Solidity style guide
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small
- Use OpenZeppelin contracts when possible

## Security

- Report security vulnerabilities privately to the maintainers
- Do not create public issues for security problems
- Allow time for fixes before public disclosure
- Follow responsible disclosure practices

## Documentation

- Update README for major changes
- Document all public functions
- Add JSDoc comments
- Update API documentation
- Include usage examples

## Review Process

1. Maintainers review PRs
2. Address feedback and comments
3. Update PR as needed
4. Approval required from at least 2 core contributors
5. Merge after approval

## Community

- Join our Discord for discussions
- Participate in governance proposals
- Help other community members
- Share your OrionDAO projects

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

