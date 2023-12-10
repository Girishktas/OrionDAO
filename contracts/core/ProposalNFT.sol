// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../interfaces/IProposalNFT.sol";

/**
 * @title ProposalNFT
 * @dev ERC-721 contract for unique proposal identification
 * @notice Each proposal is minted as an NFT for on-chain tracking
 */
contract ProposalNFT is ERC721, Ownable, IProposalNFT {
    using Counters for Counters.Counter;

    Counters.Counter private _proposalIdCounter;

    mapping(uint256 => Proposal) private _proposals;
    mapping(address => uint256[]) private _proposerProposals;

    address public votingContract;
    address public treasuryContract;

    modifier onlyVotingContract() {
        require(msg.sender == votingContract, "ProposalNFT: caller is not voting contract");
        _;
    }

    constructor() ERC721("OrionDAO Proposal", "ORION-PROP") Ownable(msg.sender) {}

    /**
     * @dev Creates a new proposal and mints NFT to proposer
     * @param title Proposal title
     * @param description Detailed description
     * @param ipfsHash IPFS hash for additional data
     * @return proposalId The ID of the newly created proposal
     */
    function createProposal(
        string memory title,
        string memory description,
        string memory ipfsHash
    ) external override returns (uint256) {
        require(bytes(title).length > 0, "ProposalNFT: title cannot be empty");
        require(bytes(ipfsHash).length > 0, "ProposalNFT: IPFS hash required");

        _proposalIdCounter.increment();
        uint256 proposalId = _proposalIdCounter.current();

        Proposal storage newProposal = _proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.ipfsHash = ipfsHash;
        newProposal.state = ProposalState.Draft;
        newProposal.createdAt = block.timestamp;

        _safeMint(msg.sender, proposalId);
        _proposerProposals[msg.sender].push(proposalId);

        emit ProposalCreated(proposalId, msg.sender, title, ipfsHash);

        return proposalId;
    }

    /**
     * @dev Updates proposal state (only callable by authorized contracts)
     * @param proposalId ID of the proposal
     * @param newState New state to transition to
     */
    function updateProposalState(
        uint256 proposalId,
        ProposalState newState
    ) external override onlyVotingContract {
        require(_ownerOf(proposalId) != address(0), "ProposalNFT: proposal does not exist");

        Proposal storage proposal = _proposals[proposalId];
        ProposalState previousState = proposal.state;

        require(_isValidStateTransition(previousState, newState), "ProposalNFT: invalid state transition");

        proposal.state = newState;

        if (newState == ProposalState.Voting) {
            proposal.votingStartTime = block.timestamp;
        } else if (newState == ProposalState.Executed) {
            proposal.executionTime = block.timestamp;
        }

        emit ProposalStateChanged(proposalId, previousState, newState);
    }

    /**
     * @dev Gets proposal details
     * @param proposalId ID of the proposal
     * @return Proposal struct containing all proposal data
     */
    function getProposal(uint256 proposalId) external view override returns (Proposal memory) {
        require(_ownerOf(proposalId) != address(0), "ProposalNFT: proposal does not exist");
        return _proposals[proposalId];
    }

    /**
     * @dev Gets current state of a proposal
     * @param proposalId ID of the proposal
     * @return Current ProposalState
     */
    function getProposalState(uint256 proposalId) external view override returns (ProposalState) {
        require(_ownerOf(proposalId) != address(0), "ProposalNFT: proposal does not exist");
        return _proposals[proposalId].state;
    }

    /**
     * @dev Gets all proposals created by an address
     * @param proposer Address of the proposer
     * @return Array of proposal IDs
     */
    function getProposerProposals(address proposer) external view returns (uint256[] memory) {
        return _proposerProposals[proposer];
    }

    /**
     * @dev Gets total number of proposals
     * @return Total proposal count
     */
    function getTotalProposals() external view returns (uint256) {
        return _proposalIdCounter.current();
    }

    /**
     * @dev Sets the voting contract address (only owner)
     * @param _votingContract Address of the voting contract
     */
    function setVotingContract(address _votingContract) external onlyOwner {
        require(_votingContract != address(0), "ProposalNFT: invalid voting contract");
        votingContract = _votingContract;
    }

    /**
     * @dev Sets the treasury contract address (only owner)
     * @param _treasuryContract Address of the treasury contract
     */
    function setTreasuryContract(address _treasuryContract) external onlyOwner {
        require(_treasuryContract != address(0), "ProposalNFT: invalid treasury contract");
        treasuryContract = _treasuryContract;
    }

    /**
     * @dev Validates state transitions
     * @param from Current state
     * @param to Target state
     * @return bool Whether transition is valid
     */
    function _isValidStateTransition(
        ProposalState from,
        ProposalState to
    ) private pure returns (bool) {
        if (from == ProposalState.Draft && to == ProposalState.Voting) return true;
        if (from == ProposalState.Voting && to == ProposalState.Finalization) return true;
        if (from == ProposalState.Finalization && to == ProposalState.Execution) return true;
        if (from == ProposalState.Execution && to == ProposalState.Executed) return true;
        if (from == ProposalState.Finalization && to == ProposalState.Rejected) return true;
        if (to == ProposalState.Cancelled) return true;
        return false;
    }

    /**
     * @dev Override to prevent transfers of proposal NFTs
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("ProposalNFT: proposals are non-transferable");
        }
        return super._update(to, tokenId, auth);
    }
}

