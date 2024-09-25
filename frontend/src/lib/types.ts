/**
 * TypeScript type definitions for OrionDAO
 */

export enum ProposalState {
  Draft = 0,
  Voting = 1,
  Finalization = 2,
  Execution = 3,
  Executed = 4,
  Rejected = 5,
  Cancelled = 6,
}

export enum MemberRole {
  None = 0,
  Member = 1,
  Contributor = 2,
  Core = 3,
  Admin = 4,
}

export interface Proposal {
  id: bigint;
  proposer: string;
  title: string;
  description: string;
  ipfsHash: string;
  state: ProposalState;
  votingStartTime: bigint;
  votingEndTime: bigint;
  createdAt: bigint;
  executionTime: bigint;
}

export interface VotingResult {
  totalSupport: bigint;
  totalAgainst: bigint;
  weightedScore: bigint;
  participantCount: bigint;
  quorumReached: boolean;
}

export interface ReputationScore {
  baseScore: bigint;
  participationScore: bigint;
  accuracyScore: bigint;
  contributionScore: bigint;
  totalScore: bigint;
  lastUpdated: bigint;
}

export interface Member {
  account: string;
  role: MemberRole;
  joinedAt: bigint;
  isActive: boolean;
  metadata: string;
}

export interface Vote {
  voter: string;
  proposalId: bigint;
  voteCount: bigint;
  voteCost: bigint;
  support: boolean;
  timestamp: bigint;
}

