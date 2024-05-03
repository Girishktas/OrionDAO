# Governance Guide

## Overview

OrionDAO implements a progressive consensus governance system that combines quadratic voting with reputation-weighted mechanisms.

## Proposal Lifecycle

### 1. Draft Phase
- Create proposal with title, description, and IPFS metadata
- Proposal NFT minted to proposer
- Initial state: Draft

### 2. Voting Phase
- Admin/Core member initiates voting
- Default duration: 7 days
- Voters lock ORION tokens
- Votes weighted by reputation
- State: Voting

### 3. Finalization Phase
- Calculate results after voting ends
- Check quorum (20% participation)
- Check threshold (50% approval)
- State: Finalization or Rejected

### 4. Execution Phase
- Approved proposals enter 48-hour timelock
- Requires multi-signature approval
- Execute on-chain actions
- State: Executed

## Voting Mechanics

### Quadratic Voting

Cost of votes follows quadratic curve:
```
cost = votes² / (reputation / 100)
```

**Example:**
- 1 vote = 1 token
- 5 votes = 25 tokens
- 10 votes = 100 tokens

Higher reputation provides discount on voting costs.

### Reputation System

Reputation score comprises:
- **Participation (30%)**: Voting frequency
- **Accuracy (40%)**: Voting with winning side
- **Contribution (30%)**: Proposal creation, community involvement

**Score Formula:**
```
Total Score = Base (100) + Weighted Components
Voting Weight = sqrt(reputation * 10000)
```

## Member Roles

### None (0)
- No governance rights

### Member (1)
- Can create proposals
- Can vote on proposals
- Basic reputation tracking

### Contributor (2)
- All Member rights
- Can comment on proposals
- Enhanced reputation gains

### Core (3)
- All Contributor rights
- Can start voting sessions
- Can update member roles

### Admin (4)
- All Core rights
- Can manage treasury
- Can update system parameters
- Emergency controls

## Treasury Management

### Scheduling Transactions

1. Executor proposes transaction
2. Include target, value, data, delay (≥48 hours)
3. Transaction enters queue

### Approval Process

1. Approvers review transaction
2. Minimum 3 approvals required
3. Timelock must expire
4. Executor executes transaction

### Emergency Procedures

- Admin can cancel transactions
- Admin can emergency withdraw
- Pause mechanism (if needed)

## Best Practices

### For Proposers

1. **Research**: Ensure proposal is well-researched
2. **IPFS**: Store detailed documentation on IPFS
3. **Discussion**: Discuss in Discord before formal proposal
4. **Timeline**: Allow sufficient time for discussion
5. **Follow-up**: Respond to questions and feedback

### For Voters

1. **Review**: Read proposal carefully
2. **IPFS**: Check linked documents
3. **Reputation**: Consider impact on your reputation
4. **Cost**: Calculate voting cost before committing
5. **Claim**: Remember to unlock tokens after voting

### For Administrators

1. **Monitoring**: Watch for suspicious activity
2. **Updates**: Keep reputation scores current
3. **Communication**: Maintain transparency
4. **Security**: Protect multi-sig keys
5. **Documentation**: Record all decisions

## Governance Parameters

### Adjustable Parameters

- Voting duration (1-30 days)
- Quorum percentage (10-50%)
- Pass threshold (50-66%)
- Approval threshold (2-10 signatures)
- Timelock delay (24-168 hours)

### Fixed Parameters

- Quadratic cost formula
- Reputation weights
- Role permissions
- Token supply caps

## Dispute Resolution

### Process

1. Raise concern in Discord #governance
2. Core team reviews
3. Emergency measures if needed
4. Community vote on resolution
5. Implement decision

### Appeal Process

- 7-day appeal window
- Requires 10% token holder support
- Reviewed by admin council
- Final decision by community vote

## Governance Metrics

### Key Metrics

- **Proposal Count**: Total proposals created
- **Voting Rate**: % of members voting
- **Pass Rate**: % of proposals approved
- **Reputation Distribution**: Member score spread
- **Treasury Activity**: Funds in/out

### Health Indicators

- **Participation**: >20% voter turnout
- **Engagement**: >50% members active monthly
- **Diversity**: No single voter >10% weight
- **Execution**: >80% approved proposals executed

## Resources

- [API Documentation](API.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Security Policy](SECURITY.md)
- [Deployment Guide](DEPLOYMENT.md)

## Support

- Discord: #governance
- Forum: forum.oriondao.io
- Email: governance@oriondao.io

