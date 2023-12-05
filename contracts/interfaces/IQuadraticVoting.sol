// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IQuadraticVoting
 * @dev Interface for Quadratic Voting mechanism
 * @notice Implements quadratic cost function to prevent whale manipulation
 */
interface IQuadraticVoting {
    struct Vote {
        address voter;
        uint256 proposalId;
        uint256 voteCount;
        uint256 voteCost;
        bool support;
        uint256 timestamp;
    }

    struct VotingResult {
        uint256 totalSupport;
        uint256 totalAgainst;
        uint256 weightedScore;
        uint256 participantCount;
        bool quorumReached;
    }

    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        uint256 voteCount,
        uint256 voteCost,
        bool support
    );

    event VotingStarted(
        uint256 indexed proposalId,
        uint256 startTime,
        uint256 endTime
    );

    event VotingFinalized(
        uint256 indexed proposalId,
        bool passed,
        uint256 totalSupport,
        uint256 totalAgainst
    );

    function startVoting(uint256 proposalId, uint256 duration) external;

    function castVote(
        uint256 proposalId,
        uint256 voteCount,
        bool support
    ) external;

    function finalizeVoting(uint256 proposalId) external returns (bool);

    function getVotingResult(uint256 proposalId) external view returns (VotingResult memory);

    function calculateVoteCost(uint256 voteCount, uint256 reputation) external pure returns (uint256);
}

