// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Constants
 * @dev System-wide constants for OrionDAO
 */
library Constants {
    // Time constants
    uint256 public constant ONE_DAY = 1 days;
    uint256 public constant ONE_WEEK = 7 days;
    uint256 public constant MINIMUM_TIMELOCK = 48 hours;
    
    // Voting constants
    uint256 public constant DEFAULT_VOTING_PERIOD = 7 days;
    uint256 public constant QUORUM_PERCENTAGE = 20; // 20%
    uint256 public constant PASS_THRESHOLD = 50; // 50%
    
    // Reputation constants
    uint256 public constant BASE_REPUTATION = 100;
    uint256 public constant MAX_REPUTATION = 10000;
    uint256 public constant MIN_REPUTATION = 10;
    
    // Weight constants (basis points)
    uint256 public constant BPS = 10000;
    uint256 public constant PARTICIPATION_WEIGHT_BPS = 3000; // 30%
    uint256 public constant ACCURACY_WEIGHT_BPS = 4000; // 40%
    uint256 public constant CONTRIBUTION_WEIGHT_BPS = 3000; // 30%
    
    // Treasury constants
    uint256 public constant DEFAULT_APPROVAL_THRESHOLD = 3;
    uint256 public constant MAX_APPROVAL_THRESHOLD = 10;
    
    // Token constants
    uint256 public constant INITIAL_TOKEN_SUPPLY = 100_000_000 * 10**18; // 100M
    uint256 public constant MAX_TOKEN_SUPPLY = 1_000_000_000 * 10**18; // 1B
}

