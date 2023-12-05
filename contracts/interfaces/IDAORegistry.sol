// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IDAORegistry
 * @dev Interface for DAO member registration and permission management
 * @notice Manages member roles and access control
 */
interface IDAORegistry {
    enum MemberRole {
        None,
        Member,
        Contributor,
        Core,
        Admin
    }

    struct Member {
        address account;
        MemberRole role;
        uint256 joinedAt;
        bool isActive;
        string metadata;
    }

    event MemberRegistered(
        address indexed account,
        MemberRole role,
        uint256 timestamp
    );

    event MemberRoleUpdated(
        address indexed account,
        MemberRole previousRole,
        MemberRole newRole
    );

    event MemberStatusChanged(
        address indexed account,
        bool isActive
    );

    function registerMember(address account, MemberRole role) external;

    function updateMemberRole(address account, MemberRole newRole) external;

    function setMemberStatus(address account, bool isActive) external;

    function isMember(address account) external view returns (bool);

    function getMemberRole(address account) external view returns (MemberRole);

    function getMember(address account) external view returns (Member memory);
}

