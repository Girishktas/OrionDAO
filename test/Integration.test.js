const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Integration Tests", function () {
  let orionToken;
  let proposalNFT;
  let daoRegistry;
  let reputationManager;
  let quadraticVoting;
  let treasury;
  let owner;
  let member1;
  let member2;
  let member3;

  beforeEach(async function () {
    [owner, member1, member2, member3] = await ethers.getSigners();

    // Deploy all contracts
    const OrionToken = await ethers.getContractFactory("OrionToken");
    orionToken = await OrionToken.deploy();
    await orionToken.waitForDeployment();

    const ProposalNFT = await ethers.getContractFactory("ProposalNFT");
    proposalNFT = await ProposalNFT.deploy();
    await proposalNFT.waitForDeployment();

    const DAORegistry = await ethers.getContractFactory("DAORegistry");
    daoRegistry = await DAORegistry.deploy();
    await daoRegistry.waitForDeployment();

    const ReputationManager = await ethers.getContractFactory("ReputationManager");
    reputationManager = await ReputationManager.deploy();
    await reputationManager.waitForDeployment();

    const QuadraticVoting = await ethers.getContractFactory("QuadraticVoting");
    quadraticVoting = await QuadraticVoting.deploy(
      await orionToken.getAddress(),
      await proposalNFT.getAddress(),
      await reputationManager.getAddress()
    );
    await quadraticVoting.waitForDeployment();

    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy(await proposalNFT.getAddress());
    await treasury.waitForDeployment();

    // Setup contracts
    await proposalNFT.setVotingContract(await quadraticVoting.getAddress());
    await proposalNFT.setTreasuryContract(await treasury.getAddress());

    // Distribute tokens
    await orionToken.transfer(member1.address, ethers.parseEther("10000"));
    await orionToken.transfer(member2.address, ethers.parseEther("10000"));
    await orionToken.transfer(member3.address, ethers.parseEther("10000"));

    // Register members
    await daoRegistry.registerMember(member1.address, 1);
    await daoRegistry.registerMember(member2.address, 2);
    await daoRegistry.registerMember(member3.address, 3);

    // Initialize reputations
    await reputationManager.initializeReputation(member1.address);
    await reputationManager.initializeReputation(member2.address);
    await reputationManager.initializeReputation(member3.address);
  });

  describe("Complete Proposal Lifecycle", function () {
    it("Should complete full proposal workflow", async function () {
      // 1. Create proposal
      const tx1 = await proposalNFT.connect(member1).createProposal(
        "Integration Test Proposal",
        "Complete workflow test",
        "QmTestHash"
      );
      await tx1.wait();

      const proposalId = 1;
      let state = await proposalNFT.getProposalState(proposalId);
      expect(state).to.equal(0); // Draft

      // 2. Start voting
      await quadraticVoting.startVoting(proposalId, 1); // 1 second for testing
      state = await proposalNFT.getProposalState(proposalId);
      expect(state).to.equal(1); // Voting

      // 3. Cast votes
      await orionToken.connect(member1).approve(
        await quadraticVoting.getAddress(),
        ethers.parseEther("100")
      );
      await quadraticVoting.connect(member1).castVote(proposalId, 5, true);

      await orionToken.connect(member2).approve(
        await quadraticVoting.getAddress(),
        ethers.parseEther("100")
      );
      await quadraticVoting.connect(member2).castVote(proposalId, 3, true);

      // 4. Finalize voting
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");

      const passed = await quadraticVoting.finalizeVoting(proposalId);
      expect(passed).to.be.true;

      state = await proposalNFT.getProposalState(proposalId);
      expect(state).to.equal(2); // Finalization

      // 5. Unlock tokens
      await quadraticVoting.connect(member1).unlockTokens(proposalId);
      await quadraticVoting.connect(member2).unlockTokens(proposalId);

      const result = await quadraticVoting.getVotingResult(proposalId);
      expect(result.participantCount).to.equal(2);
      expect(result.totalSupport).to.be.greaterThan(0);
    });

    it("Should handle rejected proposals", async function () {
      const tx = await proposalNFT.connect(member1).createProposal(
        "Test Rejection",
        "This should be rejected",
        "QmHash"
      );
      await tx.wait();

      const proposalId = 1;
      await quadraticVoting.startVoting(proposalId, 1);

      // Vote against
      await orionToken.connect(member1).approve(
        await quadraticVoting.getAddress(),
        ethers.parseEther("100")
      );
      await quadraticVoting.connect(member1).castVote(proposalId, 10, false);

      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");

      const passed = await quadraticVoting.finalizeVoting(proposalId);
      expect(passed).to.be.false;

      const state = await proposalNFT.getProposalState(proposalId);
      expect(state).to.equal(5); // Rejected
    });
  });

  describe("Multi-user Interactions", function () {
    it("Should handle multiple proposals and votes", async function () {
      // Create multiple proposals
      await proposalNFT.connect(member1).createProposal("Proposal 1", "Desc 1", "Hash1");
      await proposalNFT.connect(member2).createProposal("Proposal 2", "Desc 2", "Hash2");
      await proposalNFT.connect(member3).createProposal("Proposal 3", "Desc 3", "Hash3");

      const totalProposals = await proposalNFT.getTotalProposals();
      expect(totalProposals).to.equal(3);

      // Start voting on all
      await quadraticVoting.startVoting(1, 1);
      await quadraticVoting.startVoting(2, 1);
      await quadraticVoting.startVoting(3, 1);

      // Each member votes on different proposals
      await orionToken.connect(member1).approve(await quadraticVoting.getAddress(), ethers.parseEther("500"));
      await quadraticVoting.connect(member1).castVote(1, 5, true);
      await quadraticVoting.connect(member1).castVote(2, 3, false);

      await orionToken.connect(member2).approve(await quadraticVoting.getAddress(), ethers.parseEther("500"));
      await quadraticVoting.connect(member2).castVote(2, 5, true);
      await quadraticVoting.connect(member2).castVote(3, 2, true);

      // Check locked tokens
      const locked1 = await quadraticVoting.getTotalLockedTokens(member1.address);
      const locked2 = await quadraticVoting.getTotalLockedTokens(member2.address);

      expect(locked1).to.be.greaterThan(0);
      expect(locked2).to.be.greaterThan(0);
    });
  });

  describe("Reputation Impact on Voting", function () {
    it("Should apply reputation discount to vote costs", async function () {
      // Update member2 reputation
      await reputationManager.updateReputation(member2.address, 200, 300, 250);

      const rep1 = await reputationManager.getTotalScore(member1.address);
      const rep2 = await reputationManager.getTotalScore(member2.address);

      expect(rep2).to.be.greaterThan(rep1);

      const cost1 = await quadraticVoting.calculateVoteCost(10, rep1);
      const cost2 = await quadraticVoting.calculateVoteCost(10, rep2);

      expect(cost2).to.be.lessThan(cost1);
    });
  });
});
