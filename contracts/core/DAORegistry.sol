// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IDAORegistry.sol";

/**
 * @title DAORegistry
 * @dev Manages DAO member registration and role-based permissions
 * @notice Implements role hierarchy for governance participation
 */
contract DAORegistry is AccessControl, IDAORegistry {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CORE_ROLE = keccak256("CORE_ROLE");

    mapping(address => Member) private _members;
    address[] private _memberList;

    uint256 public totalMembers;
    uint256 public activeMembers;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(CORE_ROLE, msg.sender);

        _registerMember(msg.sender, MemberRole.Admin);
    }

    /**
     * @dev Registers a new member to the DAO
     * @param account Address to register
     * @param role Initial role for the member
     */
    function registerMember(
        address account,
        MemberRole role
    ) external override onlyRole(ADMIN_ROLE) {
        require(account != address(0), "DAORegistry: zero address");
        require(_members[account].account == address(0), "DAORegistry: already registered");

        _registerMember(account, role);

        emit MemberRegistered(account, role, block.timestamp);
    }

    /**
     * @dev Updates role of an existing member
     * @param account Address of member
     * @param newRole New role to assign
     */
    function updateMemberRole(
        address account,
        MemberRole newRole
    ) external override onlyRole(ADMIN_ROLE) {
        require(_members[account].account != address(0), "DAORegistry: not a member");

        Member storage member = _members[account];
        MemberRole previousRole = member.role;
        member.role = newRole;

        _updateRolePermissions(account, newRole);

        emit MemberRoleUpdated(account, previousRole, newRole);
    }

    /**
     * @dev Sets member active status
     * @param account Address of member
     * @param isActive New active status
     */
    function setMemberStatus(
        address account,
        bool isActive
    ) external override onlyRole(ADMIN_ROLE) {
        require(_members[account].account != address(0), "DAORegistry: not a member");

        Member storage member = _members[account];
        bool wasActive = member.isActive;
        member.isActive = isActive;

        if (wasActive && !isActive) {
            activeMembers--;
        } else if (!wasActive && isActive) {
            activeMembers++;
        }

        emit MemberStatusChanged(account, isActive);
    }

    /**
     * @dev Checks if address is a DAO member
     * @param account Address to check
     * @return bool True if member
     */
    function isMember(address account) external view override returns (bool) {
        return _members[account].account != address(0) && _members[account].isActive;
    }

    /**
     * @dev Gets member's role
     * @param account Address of member
     * @return MemberRole Current role
     */
    function getMemberRole(address account) external view override returns (MemberRole) {
        return _members[account].role;
    }

    /**
     * @dev Gets complete member information
     * @param account Address of member
     * @return Member struct
     */
    function getMember(address account) external view override returns (Member memory) {
        return _members[account];
    }

    /**
     * @dev Gets list of all member addresses
     * @return Array of member addresses
     */
    function getAllMembers() external view returns (address[] memory) {
        return _memberList;
    }

    /**
     * @dev Gets list of active members
     * @return Array of active member addresses
     */
    function getActiveMembers() external view returns (address[] memory) {
        address[] memory active = new address[](activeMembers);
        uint256 index = 0;

        for (uint256 i = 0; i < _memberList.length; i++) {
            if (_members[_memberList[i]].isActive) {
                active[index] = _memberList[i];
                index++;
            }
        }

        return active;
    }

    /**
     * @dev Checks if account has minimum required role
     * @param account Address to check
     * @param minRole Minimum required role
     * @return bool True if account meets requirement
     */
    function hasMinimumRole(address account, MemberRole minRole) external view returns (bool) {
        MemberRole accountRole = _members[account].role;
        return uint8(accountRole) >= uint8(minRole) && _members[account].isActive;
    }

    /**
     * @dev Internal function to register a member
     * @param account Address to register
     * @param role Role to assign
     */
    function _registerMember(address account, MemberRole role) private {
        Member storage newMember = _members[account];
        newMember.account = account;
        newMember.role = role;
        newMember.joinedAt = block.timestamp;
        newMember.isActive = true;
        newMember.metadata = "";

        _memberList.push(account);
        totalMembers++;
        activeMembers++;

        _updateRolePermissions(account, role);
    }

    /**
     * @dev Updates access control roles based on member role
     * @param account Address of member
     * @param role Member role
     */
    function _updateRolePermissions(address account, MemberRole role) private {
        if (role == MemberRole.Admin) {
            if (!hasRole(ADMIN_ROLE, account)) {
                _grantRole(ADMIN_ROLE, account);
            }
            if (!hasRole(CORE_ROLE, account)) {
                _grantRole(CORE_ROLE, account);
            }
        } else if (role == MemberRole.Core) {
            if (hasRole(ADMIN_ROLE, account)) {
                _revokeRole(ADMIN_ROLE, account);
            }
            if (!hasRole(CORE_ROLE, account)) {
                _grantRole(CORE_ROLE, account);
            }
        } else {
            if (hasRole(ADMIN_ROLE, account)) {
                _revokeRole(ADMIN_ROLE, account);
            }
            if (hasRole(CORE_ROLE, account)) {
                _revokeRole(CORE_ROLE, account);
            }
        }
    }
}

