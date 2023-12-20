// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IReputationManager.sol";

/**
 * @title ReputationManager
 * @dev Manages reputation scores and voting weights for DAO members
 * @notice Reputation affects voting power in quadratic voting
 */
contract ReputationManager is Ownable, IReputationManager {
    mapping(address => ReputationScore) private _reputations;

    address public reputationOracle;
    uint256 public constant BASE_REPUTATION = 100;
    uint256 public constant MAX_REPUTATION = 10000;
    uint256 public constant MIN_REPUTATION = 10;

    // Weight multipliers (basis points, 10000 = 1x)
    uint256 public constant PARTICIPATION_WEIGHT = 3000; // 30%
    uint256 public constant ACCURACY_WEIGHT = 4000; // 40%
    uint256 public constant CONTRIBUTION_WEIGHT = 3000; // 30%

    modifier onlyOracle() {
        require(msg.sender == reputationOracle || msg.sender == owner(), "ReputationManager: caller is not oracle");
        _;
    }

    constructor() Ownable(msg.sender) {
        reputationOracle = msg.sender;
    }

    /**
     * @dev Updates reputation components for a user
     * @param user Address of the user
     * @param participationDelta Change in participation score
     * @param accuracyDelta Change in accuracy score
     * @param contributionDelta Change in contribution score
     */
    function updateReputation(
        address user,
        uint256 participationDelta,
        uint256 accuracyDelta,
        uint256 contributionDelta
    ) external override onlyOracle {
        ReputationScore storage score = _reputations[user];

        if (score.baseScore == 0) {
            score.baseScore = BASE_REPUTATION;
        }

        uint256 previousTotal = score.totalScore;

        score.participationScore += participationDelta;
        score.accuracyScore += accuracyDelta;
        score.contributionScore += contributionDelta;

        uint256 newTotal = _calculateTotalScore(
            score.baseScore,
            score.participationScore,
            score.accuracyScore,
            score.contributionScore
        );

        if (newTotal > MAX_REPUTATION) {
            newTotal = MAX_REPUTATION;
        } else if (newTotal < MIN_REPUTATION) {
            newTotal = MIN_REPUTATION;
        }

        score.totalScore = newTotal;
        score.lastUpdated = block.timestamp;

        emit ReputationUpdated(user, previousTotal, newTotal, "Score updated by oracle");
    }

    /**
     * @dev Batch update reputations for multiple users
     * @param users Array of user addresses
     * @param participationDeltas Array of participation deltas
     * @param accuracyDeltas Array of accuracy deltas
     * @param contributionDeltas Array of contribution deltas
     */
    function batchUpdateReputation(
        address[] calldata users,
        uint256[] calldata participationDeltas,
        uint256[] calldata accuracyDeltas,
        uint256[] calldata contributionDeltas
    ) external onlyOracle {
        require(
            users.length == participationDeltas.length &&
            users.length == accuracyDeltas.length &&
            users.length == contributionDeltas.length,
            "ReputationManager: array length mismatch"
        );

        for (uint256 i = 0; i < users.length; i++) {
            this.updateReputation(
                users[i],
                participationDeltas[i],
                accuracyDeltas[i],
                contributionDeltas[i]
            );
        }
    }

    /**
     * @dev Gets full reputation score for a user
     * @param user Address of the user
     * @return ReputationScore struct
     */
    function getReputation(address user) external view override returns (ReputationScore memory) {
        ReputationScore memory score = _reputations[user];
        if (score.baseScore == 0) {
            score.baseScore = BASE_REPUTATION;
            score.totalScore = BASE_REPUTATION;
        }
        return score;
    }

    /**
     * @dev Gets total reputation score for a user
     * @param user Address of the user
     * @return Total reputation score
     */
    function getTotalScore(address user) external view override returns (uint256) {
        ReputationScore storage score = _reputations[user];
        if (score.totalScore == 0) {
            return BASE_REPUTATION;
        }
        return score.totalScore;
    }

    /**
     * @dev Calculates voting weight based on reputation
     * @param user Address of the user
     * @return Voting weight (scaled by 10000)
     */
    function getVotingWeight(address user) external view override returns (uint256) {
        uint256 totalScore = this.getTotalScore(user);
        // Voting weight = sqrt(reputation) to prevent excessive advantage
        return _sqrt(totalScore * 10000);
    }

    /**
     * @dev Sets the reputation oracle address
     * @param oracle New oracle address
     */
    function setReputationOracle(address oracle) external override onlyOwner {
        require(oracle != address(0), "ReputationManager: zero address");
        reputationOracle = oracle;
        emit ReputationOracleUpdated(oracle);
    }

    /**
     * @dev Initializes reputation for a new user
     * @param user Address of the user
     */
    function initializeReputation(address user) external onlyOwner {
        require(_reputations[user].baseScore == 0, "ReputationManager: already initialized");

        ReputationScore storage score = _reputations[user];
        score.baseScore = BASE_REPUTATION;
        score.totalScore = BASE_REPUTATION;
        score.lastUpdated = block.timestamp;

        emit ReputationUpdated(user, 0, BASE_REPUTATION, "Reputation initialized");
    }

    /**
     * @dev Calculates total score from components
     * @param base Base score
     * @param participation Participation score
     * @param accuracy Accuracy score
     * @param contribution Contribution score
     * @return Total calculated score
     */
    function _calculateTotalScore(
        uint256 base,
        uint256 participation,
        uint256 accuracy,
        uint256 contribution
    ) private pure returns (uint256) {
        uint256 weightedParticipation = (participation * PARTICIPATION_WEIGHT) / 10000;
        uint256 weightedAccuracy = (accuracy * ACCURACY_WEIGHT) / 10000;
        uint256 weightedContribution = (contribution * CONTRIBUTION_WEIGHT) / 10000;

        return base + weightedParticipation + weightedAccuracy + weightedContribution;
    }

    /**
     * @dev Calculates square root using Babylonian method
     * @param x Input value
     * @return Square root of x
     */
    function _sqrt(uint256 x) private pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
}

