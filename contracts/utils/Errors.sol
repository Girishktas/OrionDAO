// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Errors
 * @dev Custom error definitions for gas-efficient error handling
 */
library Errors {
    // Common errors
    error ZeroAddress();
    error InsufficientBalance();
    error Unauthorized();
    error InvalidState();
    error InvalidParameter();
    
    // ProposalNFT errors
    error TitleCannotBeEmpty();
    error IPFSHashRequired();
    error InvalidStateTransition();
    error ProposalNotTransferable();
    error ProposalDoesNotExist();
    
    // QuadraticVoting errors
    error VotingNotStarted();
    error VotingEnded();
    error VotingNotEnded();
    error AlreadyVoted();
    error VotingFinalized();
    error VotingNotFinalized();
    error NoTokensLocked();
    error InsufficientTokens();
    
    // ReputationManager errors
    error AlreadyInitialized();
    error CallerNotOracle();
    error ArrayLengthMismatch();
    
    // Treasury errors
    error DelayTooShort();
    error InsufficientApprovals();
    error TimelockNotExpired();
    error AlreadyExecuted();
    error ExecutionFailed();
    
    // DAORegistry errors
    error AlreadyRegistered();
    error NotAMember();
    error InvalidRole();
}

