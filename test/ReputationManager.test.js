const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReputationManager", function () {
  let reputationManager;
  let owner;
  let oracle;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, oracle, user1, user2] = await ethers.getSigners();

    const ReputationManager = await ethers.getContractFactory("ReputationManager");
    reputationManager = await ReputationManager.deploy();
    await reputationManager.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await reputationManager.owner()).to.equal(owner.address);
    });

    it("Should set owner as initial oracle", async function () {
      expect(await reputationManager.reputationOracle()).to.equal(owner.address);
    });

    it("Should have correct constants", async function () {
      expect(await reputationManager.BASE_REPUTATION()).to.equal(100);
      expect(await reputationManager.MAX_REPUTATION()).to.equal(10000);
      expect(await reputationManager.MIN_REPUTATION()).to.equal(10);
    });
  });

  describe("Reputation Initialization", function () {
    it("Should initialize reputation for new user", async function () {
      await expect(reputationManager.initializeReputation(user1.address))
        .to.emit(reputationManager, "ReputationUpdated")
        .withArgs(user1.address, 0, 100, "Reputation initialized");

      const reputation = await reputationManager.getReputation(user1.address);
      expect(reputation.baseScore).to.equal(100);
      expect(reputation.totalScore).to.equal(100);
    });

    it("Should fail to initialize twice", async function () {
      await reputationManager.initializeReputation(user1.address);
      await expect(
        reputationManager.initializeReputation(user1.address)
      ).to.be.revertedWith("ReputationManager: already initialized");
    });
  });

  describe("Reputation Updates", function () {
    beforeEach(async function () {
      await reputationManager.setReputationOracle(oracle.address);
      await reputationManager.initializeReputation(user1.address);
    });

    it("Should update reputation from oracle", async function () {
      await reputationManager.connect(oracle).updateReputation(
        user1.address,
        50,  // participation
        100, // accuracy
        75   // contribution
      );

      const reputation = await reputationManager.getReputation(user1.address);
      expect(reputation.participationScore).to.equal(50);
      expect(reputation.accuracyScore).to.equal(100);
      expect(reputation.contributionScore).to.equal(75);
    });

    it("Should calculate total score correctly", async function () {
      await reputationManager.connect(oracle).updateReputation(
        user1.address,
        100, 100, 100
      );

      const totalScore = await reputationManager.getTotalScore(user1.address);
      expect(totalScore).to.be.greaterThan(100); // Base + weighted components
    });

    it("Should cap at MAX_REPUTATION", async function () {
      await reputationManager.connect(oracle).updateReputation(
        user1.address,
        50000, 50000, 50000
      );

      const totalScore = await reputationManager.getTotalScore(user1.address);
      expect(totalScore).to.equal(10000); // MAX_REPUTATION
    });

    it("Should only allow oracle to update", async function () {
      await expect(
        reputationManager.connect(user2).updateReputation(user1.address, 10, 10, 10)
      ).to.be.revertedWith("ReputationManager: caller is not oracle");
    });
  });

  describe("Voting Weight Calculation", function () {
    it("Should calculate voting weight from reputation", async function () {
      await reputationManager.initializeReputation(user1.address);
      const weight = await reputationManager.getVotingWeight(user1.address);
      expect(weight).to.be.greaterThan(0);
    });

    it("Should increase weight with higher reputation", async function () {
      await reputationManager.initializeReputation(user1.address);
      await reputationManager.initializeReputation(user2.address);
      
      await reputationManager.setReputationOracle(oracle.address);
      await reputationManager.connect(oracle).updateReputation(user2.address, 500, 500, 500);

      const weight1 = await reputationManager.getVotingWeight(user1.address);
      const weight2 = await reputationManager.getVotingWeight(user2.address);
      
      expect(weight2).to.be.greaterThan(weight1);
    });
  });

  describe("Oracle Management", function () {
    it("Should update oracle address", async function () {
      await expect(reputationManager.setReputationOracle(oracle.address))
        .to.emit(reputationManager, "ReputationOracleUpdated")
        .withArgs(oracle.address);

      expect(await reputationManager.reputationOracle()).to.equal(oracle.address);
    });

    it("Should fail with zero address", async function () {
      await expect(
        reputationManager.setReputationOracle(ethers.ZeroAddress)
      ).to.be.revertedWith("ReputationManager: zero address");
    });

    it("Should only allow owner to set oracle", async function () {
      await expect(
        reputationManager.connect(user1).setReputationOracle(oracle.address)
      ).to.be.reverted;
    });
  });

  describe("Batch Updates", function () {
    beforeEach(async function () {
      await reputationManager.initializeReputation(user1.address);
      await reputationManager.initializeReputation(user2.address);
      await reputationManager.setReputationOracle(oracle.address);
    });

    it("Should batch update multiple users", async function () {
      await reputationManager.connect(oracle).batchUpdateReputation(
        [user1.address, user2.address],
        [50, 60],
        [70, 80],
        [90, 100]
      );

      const rep1 = await reputationManager.getReputation(user1.address);
      const rep2 = await reputationManager.getReputation(user2.address);

      expect(rep1.participationScore).to.equal(50);
      expect(rep2.participationScore).to.equal(60);
    });

    it("Should fail with array length mismatch", async function () {
      await expect(
        reputationManager.connect(oracle).batchUpdateReputation(
          [user1.address],
          [50, 60],
          [70],
          [90]
        )
      ).to.be.revertedWith("ReputationManager: array length mismatch");
    });
  });
});

