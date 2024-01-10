// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/ITreasury.sol";
import "../interfaces/IProposalNFT.sol";

/**
 * @title Treasury
 * @dev Manages DAO treasury with multisig and timelock
 * @notice Implements secure fund management with approval mechanism
 */
contract Treasury is AccessControl, ReentrancyGuard, ITreasury {
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant APPROVER_ROLE = keccak256("APPROVER_ROLE");

    IProposalNFT public proposalNFT;

    uint256 public constant MINIMUM_DELAY = 48 hours;
    uint256 public approvalThreshold = 3;
    uint256 public transactionCount;

    struct TransactionData {
        address target;
        uint256 value;
        bytes data;
        uint256 scheduledTime;
        bool executed;
        uint256 approvalCount;
        uint256 proposalId;
    }

    mapping(uint256 => TransactionData) private _transactions;
    mapping(uint256 => mapping(address => bool)) private _approvals;

    constructor(address _proposalNFT) {
        require(_proposalNFT != address(0), "Treasury: zero address");
        
        proposalNFT = IProposalNFT(_proposalNFT);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(EXECUTOR_ROLE, msg.sender);
        _grantRole(APPROVER_ROLE, msg.sender);
    }

    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    /**
     * @dev Schedules a transaction for future execution
     * @param target Target contract address
     * @param value Amount of ETH to send
     * @param data Encoded function call data
     * @param delay Delay before execution (must be >= MINIMUM_DELAY)
     * @return txId Transaction ID
     */
    function scheduleTransaction(
        address target,
        uint256 value,
        bytes memory data,
        uint256 delay
    ) external override onlyRole(EXECUTOR_ROLE) returns (uint256) {
        require(target != address(0), "Treasury: zero target address");
        require(delay >= MINIMUM_DELAY, "Treasury: delay too short");

        uint256 txId = transactionCount++;
        uint256 scheduledTime = block.timestamp + delay;

        TransactionData storage txData = _transactions[txId];
        txData.target = target;
        txData.value = value;
        txData.data = data;
        txData.scheduledTime = scheduledTime;
        txData.executed = false;
        txData.approvalCount = 0;

        emit TransactionScheduled(txId, target, value, scheduledTime);

        return txId;
    }

    /**
     * @dev Approves a scheduled transaction
     * @param txId Transaction ID
     */
    function approveTransaction(uint256 txId) external override onlyRole(APPROVER_ROLE) {
        require(txId < transactionCount, "Treasury: invalid transaction ID");
        require(!_transactions[txId].executed, "Treasury: already executed");
        require(!_approvals[txId][msg.sender], "Treasury: already approved");

        _approvals[txId][msg.sender] = true;
        _transactions[txId].approvalCount++;

        emit TransactionApproved(txId, msg.sender);
    }

    /**
     * @dev Executes an approved transaction after timelock
     * @param txId Transaction ID
     */
    function executeTransaction(uint256 txId) external override nonReentrant onlyRole(EXECUTOR_ROLE) {
        require(txId < transactionCount, "Treasury: invalid transaction ID");

        TransactionData storage txData = _transactions[txId];
        require(!txData.executed, "Treasury: already executed");
        require(block.timestamp >= txData.scheduledTime, "Treasury: timelock not expired");
        require(txData.approvalCount >= approvalThreshold, "Treasury: insufficient approvals");

        txData.executed = true;

        (bool success, ) = txData.target.call{value: txData.value}(txData.data);
        require(success, "Treasury: transaction execution failed");

        emit TransactionExecuted(txId, msg.sender);
    }

    /**
     * @dev Cancels a scheduled transaction
     * @param txId Transaction ID
     */
    function cancelTransaction(uint256 txId) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        require(txId < transactionCount, "Treasury: invalid transaction ID");
        require(!_transactions[txId].executed, "Treasury: already executed");

        _transactions[txId].executed = true; // Mark as executed to prevent execution

        emit TransactionCancelled(txId);
    }

    /**
     * @dev Gets treasury balance
     * @return Current ETH balance
     */
    function getBalance() external view override returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Gets transaction details
     * @param txId Transaction ID
     * @return Transaction data
     */
    function getTransaction(uint256 txId) external view returns (TransactionData memory) {
        require(txId < transactionCount, "Treasury: invalid transaction ID");
        return _transactions[txId];
    }

    /**
     * @dev Checks if address has approved a transaction
     * @param txId Transaction ID
     * @param approver Address to check
     * @return bool True if approved
     */
    function hasApproved(uint256 txId, address approver) external view returns (bool) {
        return _approvals[txId][approver];
    }

    /**
     * @dev Sets approval threshold (only admin)
     * @param threshold New threshold
     */
    function setApprovalThreshold(uint256 threshold) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(threshold > 0, "Treasury: threshold must be positive");
        approvalThreshold = threshold;
    }

    /**
     * @dev Adds an approver (only admin)
     * @param approver Address to grant approver role
     */
    function addApprover(address approver) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(APPROVER_ROLE, approver);
    }

    /**
     * @dev Removes an approver (only admin)
     * @param approver Address to revoke approver role
     */
    function removeApprover(address approver) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(APPROVER_ROLE, approver);
    }

    /**
     * @dev Emergency withdrawal (only admin)
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address payable to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(to != address(0), "Treasury: zero address");
        require(amount <= address(this).balance, "Treasury: insufficient balance");

        (bool success, ) = to.call{value: amount}("");
        require(success, "Treasury: withdrawal failed");
    }
}

