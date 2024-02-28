# OrionDAO API Documentation

## Smart Contract API Reference

### ProposalNFT

#### createProposal
```solidity
function createProposal(
    string memory title,
    string memory description,
    string memory ipfsHash
) external returns (uint256)
```
Creates a new proposal and mints an NFT.

**Parameters:**
- `title`: Proposal title (required)
- `description`: Detailed description
- `ipfsHash`: IPFS hash for additional data

**Returns:** Proposal ID

**Events:** `ProposalCreated(uint256 proposalId, address proposer, string title, string ipfsHash)`

#### updateProposalState
```solidity
function updateProposalState(
    uint256 proposalId,
    ProposalState newState
) external
```
Updates proposal state (only voting contract).

#### getProposal
```solidity
function getProposal(uint256 proposalId) 
    external view returns (Proposal memory)
```
Returns complete proposal information.

---

### QuadraticVoting

#### startVoting
```solidity
function startVoting(uint256 proposalId, uint256 duration) external
```
Initiates voting session for a proposal.

**Parameters:**
- `proposalId`: ID of the proposal
- `duration`: Voting duration in seconds (0 = default)

**Events:** `VotingStarted(uint256 proposalId, uint256 startTime, uint256 endTime)`

#### castVote
```solidity
function castVote(
    uint256 proposalId,
    uint256 voteCount,
    bool support
) external
```
Casts votes on a proposal with token locking.

**Parameters:**
- `proposalId`: ID of the proposal
- `voteCount`: Number of votes to cast
- `support`: true for support, false for against

**Requirements:**
- Voting period must be active
- User must have sufficient tokens
- User cannot vote twice

**Events:** `VoteCast(uint256 proposalId, address voter, uint256 voteCount, uint256 voteCost, bool support)`

#### finalizeVoting
```solidity
function finalizeVoting(uint256 proposalId) 
    external returns (bool)
```
Finalizes voting and determines result.

**Returns:** true if proposal passed

**Events:** `VotingFinalized(uint256 proposalId, bool passed, uint256 totalSupport, uint256 totalAgainst)`

#### calculateVoteCost
```solidity
function calculateVoteCost(uint256 voteCount, uint256 reputation) 
    public pure returns (uint256)
```
Calculates token cost for votes using quadratic formula.

**Formula:** `cost = voteCount² / (reputation / 100)`

---

### ReputationManager

#### updateReputation
```solidity
function updateReputation(
    address user,
    uint256 participationDelta,
    uint256 accuracyDelta,
    uint256 contributionDelta
) external
```
Updates reputation components (oracle only).

**Parameters:**
- `user`: User address
- `participationDelta`: Change in participation score
- `accuracyDelta`: Change in accuracy score
- `contributionDelta`: Change in contribution score

#### getReputation
```solidity
function getReputation(address user) 
    external view returns (ReputationScore memory)
```
Returns complete reputation information.

#### getTotalScore
```solidity
function getTotalScore(address user) 
    external view returns (uint256)
```
Returns total reputation score.

#### getVotingWeight
```solidity
function getVotingWeight(address user) 
    external view returns (uint256)
```
Calculates voting weight from reputation.

**Formula:** `weight = sqrt(reputation * 10000)`

---

### Treasury

#### scheduleTransaction
```solidity
function scheduleTransaction(
    address target,
    uint256 value,
    bytes memory data,
    uint256 delay
) external returns (uint256)
```
Schedules a transaction for execution (executor role).

**Parameters:**
- `target`: Target contract address
- `value`: ETH amount to send
- `data`: Encoded function call
- `delay`: Delay before execution (≥ 48 hours)

**Returns:** Transaction ID

#### approveTransaction
```solidity
function approveTransaction(uint256 txId) external
```
Approves a scheduled transaction (approver role).

#### executeTransaction
```solidity
function executeTransaction(uint256 txId) external
```
Executes an approved transaction after timelock.

**Requirements:**
- Sufficient approvals (≥ threshold)
- Timelock expired
- Not already executed

#### getBalance
```solidity
function getBalance() external view returns (uint256)
```
Returns current treasury ETH balance.

---

### DAORegistry

#### registerMember
```solidity
function registerMember(address account, MemberRole role) external
```
Registers a new DAO member (admin only).

**Parameters:**
- `account`: Member address
- `role`: Initial role (0=None, 1=Member, 2=Contributor, 3=Core, 4=Admin)

#### updateMemberRole
```solidity
function updateMemberRole(address account, MemberRole newRole) external
```
Updates member's role (admin only).

#### setMemberStatus
```solidity
function setMemberStatus(address account, bool isActive) external
```
Activates or deactivates a member (admin only).

#### isMember
```solidity
function isMember(address account) 
    external view returns (bool)
```
Checks if address is an active member.

#### getMember
```solidity
function getMember(address account) 
    external view returns (Member memory)
```
Returns complete member information.

---

### OrionToken

#### mint
```solidity
function mint(address to, uint256 amount) external
```
Mints new tokens (owner only).

**Requirements:**
- Total supply + amount ≤ MAX_SUPPLY

#### batchTransfer
```solidity
function batchTransfer(
    address[] calldata recipients,
    uint256[] calldata amounts
) external
```
Transfers tokens to multiple addresses.

---

## Event Reference

### ProposalNFT Events

- `ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title, string ipfsHash)`
- `ProposalStateChanged(uint256 indexed proposalId, ProposalState previousState, ProposalState newState)`

### QuadraticVoting Events

- `VotingStarted(uint256 indexed proposalId, uint256 startTime, uint256 endTime)`
- `VoteCast(uint256 indexed proposalId, address indexed voter, uint256 voteCount, uint256 voteCost, bool support)`
- `VotingFinalized(uint256 indexed proposalId, bool passed, uint256 totalSupport, uint256 totalAgainst)`

### ReputationManager Events

- `ReputationUpdated(address indexed user, uint256 previousScore, uint256 newScore, string reason)`
- `ReputationOracleUpdated(address indexed newOracle)`

### Treasury Events

- `FundsDeposited(address indexed from, uint256 amount)`
- `TransactionScheduled(uint256 indexed txId, address indexed target, uint256 value, uint256 scheduledTime)`
- `TransactionApproved(uint256 indexed txId, address indexed approver)`
- `TransactionExecuted(uint256 indexed txId, address indexed executor)`
- `TransactionCancelled(uint256 indexed txId)`

### DAORegistry Events

- `MemberRegistered(address indexed account, MemberRole role, uint256 timestamp)`
- `MemberRoleUpdated(address indexed account, MemberRole previousRole, MemberRole newRole)`
- `MemberStatusChanged(address indexed account, bool isActive)`

---

## Error Codes

### Common Errors

- `"zero address"`: Invalid zero address provided
- `"insufficient balance"`: Insufficient token balance
- `"unauthorized"`: Caller lacks required permissions
- `"invalid state"`: Operation not allowed in current state

### Contract-Specific Errors

**ProposalNFT:**
- `"title cannot be empty"`
- `"IPFS hash required"`
- `"invalid state transition"`
- `"proposals are non-transferable"`

**QuadraticVoting:**
- `"voting not started"`
- `"voting ended"`
- `"already voted"`
- `"voting not finalized"`

**ReputationManager:**
- `"already initialized"`
- `"caller is not oracle"`

**Treasury:**
- `"delay too short"`
- `"insufficient approvals"`
- `"timelock not expired"`

**DAORegistry:**
- `"already registered"`
- `"not a member"`

