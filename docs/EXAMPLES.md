# Usage Examples

## Creating a Proposal

```javascript
const proposalNFT = await ethers.getContractAt("ProposalNFT", proposalAddress);

const tx = await proposalNFT.createProposal(
  "Increase Marketing Budget",
  "Allocate 100 ETH for Q2 marketing campaign",
  "QmIPFSHash123..."
);

const receipt = await tx.wait();
console.log("Proposal created:", receipt.transactionHash);
```

## Starting Voting

```javascript
const quadraticVoting = await ethers.getContractAt("QuadraticVoting", votingAddress);

await quadraticVoting.startVoting(
  proposalId,
  7 * 24 * 3600 // 7 days
);
```

## Casting a Vote

```javascript
// Approve tokens
await orionToken.approve(votingAddress, voteCost);

// Cast vote
await quadraticVoting.castVote(
  proposalId,
  voteCount,
  true // support
);
```

## Checking Reputation

```javascript
const reputationManager = await ethers.getContractAt("ReputationManager", repAddress);

const score = await reputationManager.getTotalScore(userAddress);
const weight = await reputationManager.getVotingWeight(userAddress);

console.log("Reputation:", score.toString());
console.log("Voting weight:", weight.toString());
```

## Treasury Operations

```javascript
const treasury = await ethers.getContractAt("Treasury", treasuryAddress);

// Schedule transaction
const txId = await treasury.scheduleTransaction(
  targetAddress,
  ethers.parseEther("10"),
  "0x",
  48 * 3600 // 48 hours
);

// Approve transaction
await treasury.approveTransaction(txId);

// Execute after timelock
await treasury.executeTransaction(txId);
```

## Using Scripts

### Create Proposal
```bash
npx hardhat run scripts/create-proposal.js
```

### Vote on Proposal
```bash
npx hardhat run scripts/vote.js -- 1 5 true
# proposalId voteCount support
```

### Check Status
```bash
npx hardhat run scripts/check-status.js -- 1
```

### Register Member
```bash
npx hardhat run scripts/register-member.js -- 0xAddress 1
```

## Frontend Integration

```typescript
import { useContractRead, useContractWrite } from 'wagmi';

// Read proposal
const { data: proposal } = useContractRead({
  address: proposalNFTAddress,
  abi: ProposalNFT.abi,
  functionName: 'getProposal',
  args: [proposalId],
});

// Create proposal
const { write: createProposal } = useContractWrite({
  address: proposalNFTAddress,
  abi: ProposalNFT.abi,
  functionName: 'createProposal',
});

createProposal({
  args: [title, description, ipfsHash]
});
```

