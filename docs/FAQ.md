# Frequently Asked Questions (FAQ)

## General Questions

### What is OrionDAO?
OrionDAO is a decentralized autonomous organization governance framework that uses quadratic voting and reputation-weighted mechanisms to ensure fair and transparent decision-making.

### Why quadratic voting?
Quadratic voting prevents whale manipulation by making vote costs increase quadratically. This means 10 votes cost 100 tokens instead of just 10, making it expensive for single actors to dominate voting.

### What is the ORION token?
ORION is the native ERC-20 governance token used for voting in OrionDAO. It's required to participate in governance decisions.

### How is reputation calculated?
Reputation is based on three factors:
- Participation (30%): Voting frequency and engagement
- Accuracy (40%): Voting with winning proposals
- Contribution (30%): Creating proposals and community involvement

## Getting Started

### How do I join OrionDAO?
1. Connect your wallet
2. Acquire ORION tokens
3. Register as a member through the DAO Registry
4. Start participating in governance

### Where can I get ORION tokens?
- DEX trading (Uniswap, etc.)
- Community airdrops
- Contributor rewards

### What wallet do I need?
Any Ethereum-compatible wallet like MetaMask, WalletConnect, Coinbase Wallet, etc.

## Proposals

### How do I create a proposal?
1. Connect your wallet
2. Navigate to "Create Proposal"
3. Fill in title, description
4. Upload detailed documentation to IPFS
5. Submit proposal (mints NFT)

### What makes a good proposal?
- Clear objective and scope
- Detailed implementation plan
- Budget breakdown (if applicable)
- Timeline and milestones
- Community discussion beforehand

### How long does voting last?
Default voting period is 7 days, but can be adjusted by governance.

### Can I cancel my proposal?
Admins can cancel proposals in Draft state. Once voting starts, proposals cannot be cancelled.

## Voting

### How does voting work?
1. Browse active proposals
2. Review proposal details on IPFS
3. Decide vote count and direction (for/against)
4. Approve token spending
5. Cast vote (tokens locked)
6. Unlock tokens after voting ends

### What does vote cost mean?
Cost = votes² / (reputation / 100)

Example with 100 reputation:
- 1 vote = 1 token
- 5 votes = 25 tokens
- 10 votes = 100 tokens

### Can I change my vote?
No, votes are final once cast. Choose carefully!

### When can I unlock my tokens?
After voting period ends and results are finalized.

### What if I don't vote?
Non-participation affects your reputation score, reducing your voting weight in future proposals.

## Reputation

### How do I increase my reputation?
- Vote consistently
- Vote with winning proposals
- Create valuable proposals
- Contribute to community

### Can reputation decrease?
Yes, through:
- Not participating in votes
- Consistently voting against passed proposals
- Malicious behavior

### What's the benefit of high reputation?
- Lower voting costs
- Higher voting weight
- Increased influence
- Community recognition

## Treasury

### How is the treasury managed?
- Multi-signature approval (default 3)
- 48-hour timelock delay
- Transparent on-chain transactions
- Community oversight

### Who can propose treasury spending?
Members with Executor role can schedule transactions.

### How are treasury transactions approved?
1. Executor proposes transaction
2. Approvers review and approve
3. Minimum threshold met
4. Timelock expires
5. Transaction executes

## Technical Questions

### What blockchain is used?
Ethereum mainnet and compatible L2s (Optimism, Arbitrum).

### Are contracts audited?
Security audit is in progress. Current status in SECURITY.md.

### Can I integrate OrionDAO?
Yes! See API documentation and contract ABIs.

### Is the code open source?
Yes, MIT licensed. See GitHub repository.

## Troubleshooting

### Transaction failed - "insufficient balance"
Ensure you have enough ORION tokens for vote cost plus gas fees.

### "Already voted" error
You can only vote once per proposal. This is intentional.

### Tokens still locked after voting
Wait for voting to be finalized, then call unlockTokens().

### Can't create proposal
Ensure you're registered as a DAO member and have connected your wallet.

### Gas fees too high
Consider using L2 solutions or waiting for lower network congestion.

## Support

### How do I get help?
- Discord: #support channel
- Forum: forum.oriondao.io
- Email: support@oriondao.io
- Documentation: docs.oriondao.io

### How do I report a bug?
- GitHub Issues for code bugs
- security@oriondao.io for security issues
- Discord #bug-reports for general issues

### How can I contribute?
See CONTRIBUTING.md for development guidelines.

## Community

### Where can I discuss proposals?
- Discord: #governance channel
- Forum: forum.oriondao.io
- Community calls: Weekly on Discord

### How do I stay updated?
- Twitter: @OrionDAO
- Discord announcements
- Newsletter: Subscribe on website

### Is there a bug bounty?
Yes! See SECURITY.md for details and rewards.

## Advanced

### Can I delegate my votes?
Not in current version. Liquid democracy is on the roadmap.

### What about cross-chain governance?
Planned for Phase 4. See roadmap in README.

### How do I run a node?
Not required for participation. Just connect your wallet.

### Can I fork OrionDAO?
Yes! It's open source under MIT license.

---

Still have questions? Join our [Discord](https://discord.gg/oriondao) or visit [docs.oriondao.io](https://docs.oriondao.io)

