// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Math
 * @dev Mathematical utilities for OrionDAO
 */
library Math {
    /**
     * @dev Returns the square root of a number using Babylonian method
     * @param x Input value
     * @return Square root of x
     */
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    /**
     * @dev Returns the minimum of two numbers
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the maximum of two numbers
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Calculates percentage with basis points precision
     * @param amount Base amount
     * @param bps Basis points (10000 = 100%)
     */
    function percentage(uint256 amount, uint256 bps) internal pure returns (uint256) {
        return (amount * bps) / 10000;
    }

    /**
     * @dev Checks if a value is within a range
     */
    function inRange(uint256 value, uint256 minValue, uint256 maxValue) internal pure returns (bool) {
        return value >= minValue && value <= maxValue;
    }
}
