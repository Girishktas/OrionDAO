const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QuadraticVoting", function () {
  let orionToken;
  let proposalNFT;
  let reputationManager;
  let quadraticVoting;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const OrionToken = await ethers.getContractFactory("OrionToken");
    orionToken = await OrionToken.deploy();
    await orionToken.waitForDeployment();

    const ProposalNFT = await ethers.getContractFactory("ProposalNFT");
    proposalNFT = await ProposalNFT.deploy();
    await proposalNFT.waitForDeployment();

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

    await proposalNFT.setVotingContract(await quadraticVoting.getAddress());

    await orionToken.transfer(addr1.address, ethers.parseEther("1000"));
    await orionToken.transfer(addr2.address, ethers.parseEther("1000"));

    await reputationManager.initializeReputation(addr1.address);
    await reputationManager.initializeReputation(addr2.address);
  });

  describe("Vote Cost Calculation", function () {
    it("Should calculate quadratic cost correctly", async function () {
      const cost1 = await quadraticVoting.calculateVoteCost(1, 100);
      const cost5 = await quadraticVoting.calculateVoteCost(5, 100);
      const cost10 = await quadraticVoting.calculateVoteCost(10, 100);

      expect(cost1).to.equal(1);
      expect(cost5).to.equal(25);
      expect(cost10).to.equal(100);
    });

    it("Should apply reputation discount", async function () {
      const costLowRep = await quadraticVoting.calculateVoteCost(10, 100);
      const costHighRep = await quadraticVoting.calculateVoteCost(10, 200);

      expect(costHighRep).to.be.lessThan(costLowRep);
    });
  });

  describe("Voting Process", function () {
    let proposalId;

    beforeEach(async function () {
      proposalId = 1;
      await proposalNFT.connect(addr1).createProposal(
        "Test Proposal",
        "Description",
        "QmHash"
      );
      await quadraticVoting.startVoting(proposalId, 7 * 24 * 3600);
    });

    it("Should start voting successfully", async function () {
      const result = await quadraticVoting.getVotingResult(proposalId);
      expect(result.participantCount).to.equal(0);
    });

    it("Should cast vote with token locking", async function () {
      await orionToken.connect(addr1).approve(
        await quadraticVoting.getAddress(),
        ethers.parseEther("100")
      );

      await expect(quadraticVoting.connect(addr1).castVote(proposalId, 5, true))
        .to.emit(quadraticVoting, "VoteCast");

      const lockedTokens = await quadraticVoting.getLockedTokens(proposalId, addr1.address);
      expect(lockedTokens).to.be.greaterThan(0);
    });

    it("Should prevent double voting", async function () {
      await orionToken.connect(addr1).approve(
        await quadraticVoting.getAddress(),
        ethers.parseEther("100")
      );

      await quadraticVoting.connect(addr1).castVote(proposalId, 5, true);

      await expect(
        quadraticVoting.connect(addr1).castVote(proposalId, 3, false)
      ).to.be.revertedWith("QuadraticVoting: already voted");
    });

    it("Should track voting results", async function () {
      await orionToken.connect(addr1).approve(
        await quadraticVoting.getAddress(),
        ethers.parseEther("100")
      );
      await orionToken.connect(addr2).approve(
        await quadraticVoting.getAddress(),
        ethers.parseEther("100")
      );

      await quadraticVoting.connect(addr1).castVote(proposalId, 5, true);
      await quadraticVoting.connect(addr2).castVote(proposalId, 3, false);

      const result = await quadraticVoting.getVotingResult(proposalId);
      expect(result.participantCount).to.equal(2);
      expect(result.totalSupport).to.be.greaterThan(0);
      expect(result.totalAgainst).to.be.greaterThan(0);
    });
  });

  describe("Vote Finalization", function () {
    let proposalId;

    beforeEach(async function () {
      proposalId = 1;
      await proposalNFT.connect(addr1).createProposal(
        "Test Proposal",
        "Description",
        "QmHash"
      );
      await quadraticVoting.startVoting(proposalId, 1); // 1 second for testing
    });

    it("Should not finalize before voting ends", async function () {
      await expect(
        quadraticVoting.finalizeVoting(proposalId)
      ).to.be.revertedWith("QuadraticVoting: voting not ended");
    });

    it("Should finalize after voting period", async function () {
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");

      await expect(quadraticVoting.finalizeVoting(proposalId))
        .to.emit(quadraticVoting, "VotingFinalized");
    });

    it("Should unlock tokens after finalization", async function () {
      await orionToken.connect(addr1).approve(
        await quadraticVoting.getAddress(),
        ethers.parseEther("100")
      );
      await quadraticVoting.connect(addr1).castVote(proposalId, 5, true);

      const balanceBefore = await orionToken.balanceOf(addr1.address);

      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");

      await quadraticVoting.finalizeVoting(proposalId);
      await quadraticVoting.connect(addr1).unlockTokens(proposalId);

      const balanceAfter = await orionToken.balanceOf(addr1.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });
  });
});

