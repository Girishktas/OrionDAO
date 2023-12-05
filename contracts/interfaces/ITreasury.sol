// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ITreasury
 * @dev Interface for Treasury contract managing DAO funds
 * @notice Implements multisig and timelock for secure fund management
 */
interface ITreasury {
    struct Transaction {
        address target;
        uint256 value;
        bytes data;
        uint256 scheduledTime;
        bool executed;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    event FundsDeposited(address indexed from, uint256 amount);

    event TransactionScheduled(
        uint256 indexed txId,
        address indexed target,
        uint256 value,
        uint256 scheduledTime
    );

    event TransactionApproved(
        uint256 indexed txId,
        address indexed approver
    );

    event TransactionExecuted(
        uint256 indexed txId,
        address indexed executor
    );

    event TransactionCancelled(uint256 indexed txId);

    function scheduleTransaction(
        address target,
        uint256 value,
        bytes memory data,
        uint256 delay
    ) external returns (uint256);

    function approveTransaction(uint256 txId) external;

    function executeTransaction(uint256 txId) external;

    function cancelTransaction(uint256 txId) external;

    function getBalance() external view returns (uint256);
}

