// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IQuadraticVoting.sol";
import "../interfaces/IProposalNFT.sol";
import "../interfaces/IReputationManager.sol";

/**
 * @title QuadraticVoting
 * @dev Implements quadratic voting mechanism with reputation weighting
 * @notice Prevents whale manipulation through quadratic cost curves
 */
contract QuadraticVoting is Ownable, ReentrancyGuard, IQuadraticVoting {
    IERC20 public votingToken;
    IProposalNFT public proposalNFT;
    IReputationManager public reputationManager;

    uint256 public constant QUORUM_PERCENTAGE = 20; // 20% quorum
    uint256 public constant PASS_THRESHOLD = 50; // 50% to pass
    uint256 public votingDuration = 7 days;

    struct VotingSession {
        uint256 startTime;
        uint256 endTime;
        bool finalized;
        uint256 totalSupport;
        uint256 totalAgainst;
        uint256 participantCount;
        mapping(address => Vote) votes;
        mapping(address => uint256) lockedTokens;
    }

    mapping(uint256 => VotingSession) private _votingSessions;
    mapping(address => uint256) private _totalLockedTokens;

    constructor(
        address _votingToken,
        address _proposalNFT,
        address _reputationManager
    ) Ownable(msg.sender) {
        require(_votingToken != address(0), "QuadraticVoting: zero token address");
        require(_proposalNFT != address(0), "QuadraticVoting: zero proposal address");
        require(_reputationManager != address(0), "QuadraticVoting: zero reputation address");

        votingToken = IERC20(_votingToken);
        proposalNFT = IProposalNFT(_proposalNFT);
        reputationManager = IReputationManager(_reputationManager);
    }

    /**
     * @dev Starts voting session for a proposal
     * @param proposalId ID of the proposal
     * @param duration Duration of voting in seconds
     */
    function startVoting(uint256 proposalId, uint256 duration) external override onlyOwner {
        IProposalNFT.ProposalState state = proposalNFT.getProposalState(proposalId);
        require(state == IProposalNFT.ProposalState.Draft, "QuadraticVoting: invalid proposal state");

        VotingSession storage session = _votingSessions[proposalId];
        require(session.startTime == 0, "QuadraticVoting: voting already started");

        uint256 voteDuration = duration > 0 ? duration : votingDuration;
        session.startTime = block.timestamp;
        session.endTime = block.timestamp + voteDuration;

        proposalNFT.updateProposalState(proposalId, IProposalNFT.ProposalState.Voting);

        emit VotingStarted(proposalId, session.startTime, session.endTime);
    }

    /**
     * @dev Casts vote on a proposal
     * @param proposalId ID of the proposal
     * @param voteCount Number of votes to cast
     * @param support True for support, false for against
     */
    function castVote(
        uint256 proposalId,
        uint256 voteCount,
        bool support
    ) external override nonReentrant {
        require(voteCount > 0, "QuadraticVoting: vote count must be positive");

        VotingSession storage session = _votingSessions[proposalId];
        require(session.startTime > 0, "QuadraticVoting: voting not started");
        require(block.timestamp >= session.startTime, "QuadraticVoting: voting not started yet");
        require(block.timestamp < session.endTime, "QuadraticVoting: voting ended");
        require(!session.finalized, "QuadraticVoting: voting finalized");

        Vote storage existingVote = session.votes[msg.sender];
        require(existingVote.voteCount == 0, "QuadraticVoting: already voted");

        uint256 reputation = reputationManager.getTotalScore(msg.sender);
        uint256 voteCost = calculateVoteCost(voteCount, reputation);

        require(
            votingToken.balanceOf(msg.sender) >= voteCost,
            "QuadraticVoting: insufficient token balance"
        );

        require(
            votingToken.transferFrom(msg.sender, address(this), voteCost),
            "QuadraticVoting: token transfer failed"
        );

        session.lockedTokens[msg.sender] = voteCost;
        _totalLockedTokens[msg.sender] += voteCost;

        uint256 votingWeight = reputationManager.getVotingWeight(msg.sender);
        uint256 weightedVotes = (voteCount * votingWeight) / 10000;

        existingVote.voter = msg.sender;
        existingVote.proposalId = proposalId;
        existingVote.voteCount = voteCount;
        existingVote.voteCost = voteCost;
        existingVote.support = support;
        existingVote.timestamp = block.timestamp;

        if (support) {
            session.totalSupport += weightedVotes;
        } else {
            session.totalAgainst += weightedVotes;
        }

        session.participantCount++;

        emit VoteCast(proposalId, msg.sender, voteCount, voteCost, support);
    }

    /**
     * @dev Finalizes voting and determines result
     * @param proposalId ID of the proposal
     * @return bool True if proposal passed
     */
    function finalizeVoting(uint256 proposalId) external override nonReentrant returns (bool) {
        VotingSession storage session = _votingSessions[proposalId];
        require(session.startTime > 0, "QuadraticVoting: voting not started");
        require(block.timestamp >= session.endTime, "QuadraticVoting: voting not ended");
        require(!session.finalized, "QuadraticVoting: already finalized");

        session.finalized = true;

        uint256 totalVotes = session.totalSupport + session.totalAgainst;
        bool passed = false;

        if (totalVotes > 0) {
            uint256 supportPercentage = (session.totalSupport * 100) / totalVotes;
            passed = supportPercentage >= PASS_THRESHOLD;
        }

        IProposalNFT.ProposalState newState = passed
            ? IProposalNFT.ProposalState.Finalization
            : IProposalNFT.ProposalState.Rejected;

        proposalNFT.updateProposalState(proposalId, newState);

        emit VotingFinalized(proposalId, passed, session.totalSupport, session.totalAgainst);

        return passed;
    }

    /**
     * @dev Unlocks tokens after voting finalization
     * @param proposalId ID of the proposal
     */
    function unlockTokens(uint256 proposalId) external nonReentrant {
        VotingSession storage session = _votingSessions[proposalId];
        require(session.finalized, "QuadraticVoting: voting not finalized");

        uint256 lockedAmount = session.lockedTokens[msg.sender];
        require(lockedAmount > 0, "QuadraticVoting: no tokens locked");

        session.lockedTokens[msg.sender] = 0;
        _totalLockedTokens[msg.sender] -= lockedAmount;

        require(
            votingToken.transfer(msg.sender, lockedAmount),
            "QuadraticVoting: token transfer failed"
        );
    }

    /**
     * @dev Gets voting result for a proposal
     * @param proposalId ID of the proposal
     * @return VotingResult struct
     */
    function getVotingResult(uint256 proposalId) external view override returns (VotingResult memory) {
        VotingSession storage session = _votingSessions[proposalId];

        uint256 totalVotes = session.totalSupport + session.totalAgainst;
        uint256 weightedScore = session.totalSupport > session.totalAgainst
            ? session.totalSupport - session.totalAgainst
            : 0;

        bool quorumReached = session.participantCount >= 1; // Simplified for demo

        return VotingResult({
            totalSupport: session.totalSupport,
            totalAgainst: session.totalAgainst,
            weightedScore: weightedScore,
            participantCount: session.participantCount,
            quorumReached: quorumReached
        });
    }

    /**
     * @dev Calculates cost of votes using quadratic formula
     * @param voteCount Number of votes
     * @param reputation Voter's reputation score
     * @return Cost in tokens
     */
    function calculateVoteCost(
        uint256 voteCount,
        uint256 reputation
    ) public pure override returns (uint256) {
        uint256 baseCost = voteCount * voteCount;
        uint256 reputationDiscount = reputation > 100 ? reputation / 100 : 1;
        return baseCost / reputationDiscount;
    }

    /**
     * @dev Gets vote details for an address on a proposal
     * @param proposalId ID of the proposal
     * @param voter Address of the voter
     * @return Vote struct
     */
    function getVote(uint256 proposalId, address voter) external view returns (Vote memory) {
        return _votingSessions[proposalId].votes[voter];
    }

    /**
     * @dev Gets locked token amount for an address on a proposal
     * @param proposalId ID of the proposal
     * @param voter Address of the voter
     * @return Locked token amount
     */
    function getLockedTokens(uint256 proposalId, address voter) external view returns (uint256) {
        return _votingSessions[proposalId].lockedTokens[voter];
    }

    /**
     * @dev Gets total locked tokens for an address across all proposals
     * @param voter Address of the voter
     * @return Total locked tokens
     */
    function getTotalLockedTokens(address voter) external view returns (uint256) {
        return _totalLockedTokens[voter];
    }

    /**
     * @dev Sets voting duration (only owner)
     * @param duration New duration in seconds
     */
    function setVotingDuration(uint256 duration) external onlyOwner {
        require(duration >= 1 days && duration <= 30 days, "QuadraticVoting: invalid duration");
        votingDuration = duration;
    }
}

