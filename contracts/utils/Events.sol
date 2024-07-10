// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Events
 * @dev Centralized event definitions for OrionDAO
 */
library Events {
    // Proposal events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title
    );
    
    event ProposalStateChanged(
        uint256 indexed proposalId,
        uint8 previousState,
        uint8 newState
    );
    
    // Voting events
    event VotingStarted(
        uint256 indexed proposalId,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        uint256 voteCount,
        bool support
    );
    
    event VotingFinalized(
        uint256 indexed proposalId,
        bool passed
    );
    
    // Reputation events
    event ReputationUpdated(
        address indexed user,
        uint256 newScore
    );
    
    // Treasury events
    event FundsDeposited(
        address indexed from,
        uint256 amount
    );
    
    event TransactionExecuted(
        uint256 indexed txId,
        address indexed target
    );
    
    // Member events
    event MemberRegistered(
        address indexed member,
        uint8 role
    );
}

