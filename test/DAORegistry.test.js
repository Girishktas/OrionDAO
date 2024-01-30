const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAORegistry", function () {
  let daoRegistry;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const DAORegistry = await ethers.getContractFactory("DAORegistry");
    daoRegistry = await DAORegistry.deploy();
    await daoRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should register owner as admin", async function () {
      expect(await daoRegistry.getMemberRole(owner.address)).to.equal(4); // Admin role
    });

    it("Should have correct initial member counts", async function () {
      expect(await daoRegistry.totalMembers()).to.equal(1);
      expect(await daoRegistry.activeMembers()).to.equal(1);
    });
  });

  describe("Member Registration", function () {
    it("Should register a new member", async function () {
      await expect(daoRegistry.registerMember(addr1.address, 1))
        .to.emit(daoRegistry, "MemberRegistered")
        .withArgs(addr1.address, 1, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));

      expect(await daoRegistry.isMember(addr1.address)).to.be.true;
      expect(await daoRegistry.totalMembers()).to.equal(2);
    });

    it("Should fail to register with zero address", async function () {
      await expect(
        daoRegistry.registerMember(ethers.ZeroAddress, 1)
      ).to.be.revertedWith("DAORegistry: zero address");
    });

    it("Should fail to register existing member", async function () {
      await daoRegistry.registerMember(addr1.address, 1);
      await expect(
        daoRegistry.registerMember(addr1.address, 1)
      ).to.be.revertedWith("DAORegistry: already registered");
    });

    it("Should only allow admin to register", async function () {
      await expect(
        daoRegistry.connect(addr1).registerMember(addr2.address, 1)
      ).to.be.reverted;
    });
  });

  describe("Role Management", function () {
    beforeEach(async function () {
      await daoRegistry.registerMember(addr1.address, 1); // Member
    });

    it("Should update member role", async function () {
      await expect(daoRegistry.updateMemberRole(addr1.address, 2))
        .to.emit(daoRegistry, "MemberRoleUpdated")
        .withArgs(addr1.address, 1, 2);

      expect(await daoRegistry.getMemberRole(addr1.address)).to.equal(2);
    });

    it("Should fail to update non-member role", async function () {
      await expect(
        daoRegistry.updateMemberRole(addr2.address, 2)
      ).to.be.revertedWith("DAORegistry: not a member");
    });

    it("Should check minimum role requirement", async function () {
      expect(await daoRegistry.hasMinimumRole(addr1.address, 1)).to.be.true;
      expect(await daoRegistry.hasMinimumRole(addr1.address, 2)).to.be.false;
    });
  });

  describe("Member Status", function () {
    beforeEach(async function () {
      await daoRegistry.registerMember(addr1.address, 1);
    });

    it("Should deactivate member", async function () {
      await expect(daoRegistry.setMemberStatus(addr1.address, false))
        .to.emit(daoRegistry, "MemberStatusChanged")
        .withArgs(addr1.address, false);

      expect(await daoRegistry.isMember(addr1.address)).to.be.false;
      expect(await daoRegistry.activeMembers()).to.equal(1);
    });

    it("Should reactivate member", async function () {
      await daoRegistry.setMemberStatus(addr1.address, false);
      await daoRegistry.setMemberStatus(addr1.address, true);

      expect(await daoRegistry.isMember(addr1.address)).to.be.true;
      expect(await daoRegistry.activeMembers()).to.equal(2);
    });
  });

  describe("Member Queries", function () {
    beforeEach(async function () {
      await daoRegistry.registerMember(addr1.address, 1);
      await daoRegistry.registerMember(addr2.address, 2);
      await daoRegistry.registerMember(addr3.address, 1);
    });

    it("Should get all members", async function () {
      const allMembers = await daoRegistry.getAllMembers();
      expect(allMembers.length).to.equal(4); // Including owner
    });

    it("Should get active members only", async function () {
      await daoRegistry.setMemberStatus(addr2.address, false);
      const activeMembers = await daoRegistry.getActiveMembers();
      expect(activeMembers.length).to.equal(3);
    });

    it("Should get member details", async function () {
      const member = await daoRegistry.getMember(addr1.address);
      expect(member.account).to.equal(addr1.address);
      expect(member.role).to.equal(1);
      expect(member.isActive).to.be.true;
    });
  });
});

