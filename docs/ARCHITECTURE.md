# OrionDAO Architecture

## System Overview

OrionDAO implements a progressive consensus governance system combining quadratic voting with reputation-weighted mechanisms.

## Smart Contract Architecture

### Core Contracts

#### 1. ProposalNFT.sol
- **Purpose**: Unique proposal identification using ERC-721
- **Key Features**:
  - Mints NFT for each proposal
  - Manages proposal lifecycle states
  - Non-transferable tokens
  - IPFS integration for metadata

#### 2. QuadraticVoting.sol
- **Purpose**: Implements quadratic voting mechanism
- **Key Features**:
  - Quadratic cost curve: cost = votes²
  - Token locking during voting
  - Reputation-weighted votes
  - Quorum and threshold checks

#### 3. ReputationManager.sol
- **Purpose**: Manages user reputation scores
- **Key Features**:
  - Dynamic score calculation
  - Oracle-based updates
  - Voting weight derivation
  - Batch update support

#### 4. Treasury.sol
- **Purpose**: Secure fund management
- **Key Features**:
  - Multi-signature approval
  - 48-hour timelock
  - Role-based access control
  - Emergency withdrawal

#### 5. DAORegistry.sol
- **Purpose**: Member registration and permissions
- **Key Features**:
  - Role hierarchy (Member, Contributor, Core, Admin)
  - Active/inactive status tracking
  - Permission management
  - Member queries

#### 6. OrionToken.sol
- **Purpose**: Governance and voting token
- **Key Features**:
  - ERC-20 standard
  - Capped supply (1B tokens)
  - Minting capability
  - Batch transfers

## Data Flow

```
┌─────────────┐
│   Member    │
└──────┬──────┘
       │
       ├──────► Create Proposal (ProposalNFT)
       │        └──► Mint NFT, State: Draft
       │
       ├──────► Start Voting (QuadraticVoting)
       │        ├──► Lock Tokens
       │        ├──► Calculate Vote Cost
       │        └──► Update State: Voting
       │
       ├──────► Cast Vote
       │        ├──► Check Reputation
       │        ├──► Apply Weight
       │        └──► Record Vote
       │
       ├──────► Finalize Voting
       │        ├──► Calculate Result
       │        ├──► Update Reputation
       │        └──► State: Finalization
       │
       └──────► Execute (Treasury)
                ├──► Check Approvals
                ├──► Wait for Timelock
                └──► Execute Transaction
```

## State Machine

### Proposal States

1. **Draft** → Initial state after creation
2. **Voting** → Active voting period
3. **Finalization** → Voting complete, processing results
4. **Execution** → Approved, waiting for execution
5. **Executed** → Successfully executed
6. **Rejected** → Failed to pass
7. **Cancelled** → Manually cancelled

### State Transitions

```
Draft ──► Voting ──► Finalization ──┬──► Execution ──► Executed
                                     └──► Rejected

Any State ──► Cancelled (Admin only)
```

## Security Model

### Access Control

- **Owner**: Contract deployer, system admin
- **Admin**: High-level governance operations
- **Core**: Trusted contributors
- **Contributor**: Active participants
- **Member**: Basic voting rights

### Security Mechanisms

1. **Token Locking**: Prevents manipulation through rapid buy/vote/sell
2. **Quadratic Cost**: Diminishes returns for large vote amounts
3. **Reputation Weighting**: Rewards consistent participation
4. **Timelock**: 48-hour delay for critical operations
5. **Multi-signature**: Requires multiple approvals
6. **ReentrancyGuard**: Prevents reentrancy attacks
7. **Role-based Access**: Granular permission control

## Frontend Architecture

### Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi + viem
- **State**: React Query
- **Wallet**: RainbowKit

### Component Structure

```
src/
├── pages/
│   ├── index.tsx          # Landing page
│   ├── proposals/         # Proposal browsing
│   ├── create/            # Proposal creation
│   └── governance/        # Governance dashboard
├── components/
│   ├── Layout/            # App layout
│   ├── Proposal/          # Proposal components
│   ├── Voting/            # Voting interface
│   └── Treasury/          # Treasury management
└── lib/
    ├── contracts.ts       # Contract configs
    ├── utils.ts           # Helper functions
    └── hooks/             # Custom React hooks
```

## Integration Points

### TheGraph (Subgraph)

- Indexes all contract events
- Provides efficient querying
- Caches historical data
- Real-time updates

### IPFS

- Stores proposal details
- Hosts off-chain metadata
- Decentralized storage
- Content addressing

### Chainlink Oracle

- Updates reputation scores
- Off-chain computation
- Reliable data feeds
- Automated execution

## Scalability Considerations

### Gas Optimization

- Efficient storage patterns
- Batch operations
- Event-based indexing
- Minimal on-chain data

### Layer 2 Compatibility

- Compatible with Optimism, Arbitrum
- Cross-chain messaging ready
- Reduced transaction costs
- Faster finality

## Future Enhancements

1. **Snapshot Integration**: Off-chain voting for signaling
2. **Cross-chain Governance**: Multi-chain proposal execution
3. **AI-powered Analysis**: Proposal impact prediction
4. **Privacy Features**: Anonymous voting options
5. **Advanced Delegation**: Liquid democracy implementation

