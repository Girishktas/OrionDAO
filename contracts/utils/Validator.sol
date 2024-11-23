// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Validator
 * @dev Input validation utilities for OrionDAO contracts
 */
library Validator {
    /**
     * @dev Validates that an address is not zero
     * @param addr Address to validate
     * @param errorMessage Error message if validation fails
     */
    function requireNonZeroAddress(address addr, string memory errorMessage) internal pure {
        require(addr != address(0), errorMessage);
    }

    /**
     * @dev Validates that a string is not empty
     * @param str String to validate
     * @param errorMessage Error message if validation fails
     */
    function requireNonEmptyString(string memory str, string memory errorMessage) internal pure {
        require(bytes(str).length > 0, errorMessage);
    }

    /**
     * @dev Validates that a value is within a range
     * @param value Value to check
     * @param minValue Minimum allowed value
     * @param maxValue Maximum allowed value
     * @param errorMessage Error message if validation fails
     */
    function requireInRange(
        uint256 value,
        uint256 minValue,
        uint256 maxValue,
        string memory errorMessage
    ) internal pure {
        require(value >= minValue && value <= maxValue, errorMessage);
    }

    /**
     * @dev Validates that arrays have the same length
     * @param arr1Length Length of first array
     * @param arr2Length Length of second array
     * @param errorMessage Error message if validation fails
     */
    function requireSameLength(
        uint256 arr1Length,
        uint256 arr2Length,
        string memory errorMessage
    ) internal pure {
        require(arr1Length == arr2Length, errorMessage);
    }

    /**
     * @dev Validates that a value is positive (greater than zero)
     * @param value Value to check
     * @param errorMessage Error message if validation fails
     */
    function requirePositive(uint256 value, string memory errorMessage) internal pure {
        require(value > 0, errorMessage);
    }

    /**
     * @dev Validates timestamp is in the future
     * @param timestamp Timestamp to check
     * @param errorMessage Error message if validation fails
     */
    function requireFutureTimestamp(uint256 timestamp, string memory errorMessage) internal view {
        require(timestamp > block.timestamp, errorMessage);
    }

    /**
     * @dev Validates timestamp is in the past
     * @param timestamp Timestamp to check
     * @param errorMessage Error message if validation fails
     */
    function requirePastTimestamp(uint256 timestamp, string memory errorMessage) internal view {
        require(timestamp <= block.timestamp, errorMessage);
    }
}
