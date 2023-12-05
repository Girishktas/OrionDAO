// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IReputationManager
 * @dev Interface for Reputation management system
 * @notice Manages user reputation scores and voting weights
 */
interface IReputationManager {
    struct ReputationScore {
        uint256 baseScore;
        uint256 participationScore;
        uint256 accuracyScore;
        uint256 contributionScore;
        uint256 totalScore;
        uint256 lastUpdated;
    }

    event ReputationUpdated(
        address indexed user,
        uint256 previousScore,
        uint256 newScore,
        string reason
    );

    event ReputationOracleUpdated(address indexed newOracle);

    function updateReputation(
        address user,
        uint256 participationDelta,
        uint256 accuracyDelta,
        uint256 contributionDelta
    ) external;

    function getReputation(address user) external view returns (ReputationScore memory);

    function getTotalScore(address user) external view returns (uint256);

    function getVotingWeight(address user) external view returns (uint256);

    function setReputationOracle(address oracle) external;
}

