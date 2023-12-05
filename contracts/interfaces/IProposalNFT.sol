// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IProposalNFT
 * @dev Interface for Proposal NFT contract
 * @notice Each proposal is represented as a unique ERC-721 token
 */
interface IProposalNFT {
    enum ProposalState {
        Draft,
        Voting,
        Finalization,
        Execution,
        Executed,
        Rejected,
        Cancelled
    }

    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        string ipfsHash;
        ProposalState state;
        uint256 votingStartTime;
        uint256 votingEndTime;
        uint256 createdAt;
        uint256 executionTime;
    }

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        string ipfsHash
    );

    event ProposalStateChanged(
        uint256 indexed proposalId,
        ProposalState previousState,
        ProposalState newState
    );

    function createProposal(
        string memory title,
        string memory description,
        string memory ipfsHash
    ) external returns (uint256);

    function updateProposalState(
        uint256 proposalId,
        ProposalState newState
    ) external;

    function getProposal(uint256 proposalId) external view returns (Proposal memory);

    function getProposalState(uint256 proposalId) external view returns (ProposalState);
}

