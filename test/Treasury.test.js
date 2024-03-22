const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Treasury", function () {
  let treasury;
  let proposalNFT;
  let owner;
  let approver1;
  let approver2;
  let approver3;
  let executor;

  beforeEach(async function () {
    [owner, approver1, approver2, approver3, executor] = await ethers.getSigners();

    const ProposalNFT = await ethers.getContractFactory("ProposalNFT");
    proposalNFT = await ProposalNFT.deploy();
    await proposalNFT.waitForDeployment();

    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy(await proposalNFT.getAddress());
    await treasury.waitForDeployment();

    // Setup roles
    const APPROVER_ROLE = await treasury.APPROVER_ROLE();
    const EXECUTOR_ROLE = await treasury.EXECUTOR_ROLE();

    await treasury.grantRole(APPROVER_ROLE, approver1.address);
    await treasury.grantRole(APPROVER_ROLE, approver2.address);
    await treasury.grantRole(APPROVER_ROLE, approver3.address);
    await treasury.grantRole(EXECUTOR_ROLE, executor.address);

    // Fund treasury
    await owner.sendTransaction({
      to: await treasury.getAddress(),
      value: ethers.parseEther("10")
    });
  });

  describe("Deployment", function () {
    it("Should set correct roles", async function () {
      const ADMIN_ROLE = await treasury.DEFAULT_ADMIN_ROLE();
      expect(await treasury.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should receive ETH", async function () {
      const balance = await treasury.getBalance();
      expect(balance).to.equal(ethers.parseEther("10"));
    });

    it("Should have correct approval threshold", async function () {
      expect(await treasury.approvalThreshold()).to.equal(3);
    });
  });

  describe("Transaction Scheduling", function () {
    it("Should schedule transaction", async function () {
      const delay = 48 * 3600; // 48 hours
      
      await expect(
        treasury.connect(executor).scheduleTransaction(
          approver1.address,
          ethers.parseEther("1"),
          "0x",
          delay
        )
      ).to.emit(treasury, "TransactionScheduled");
    });

    it("Should fail with insufficient delay", async function () {
      const delay = 24 * 3600; // 24 hours - too short

      await expect(
        treasury.connect(executor).scheduleTransaction(
          approver1.address,
          ethers.parseEther("1"),
          "0x",
          delay
        )
      ).to.be.revertedWith("Treasury: delay too short");
    });

    it("Should fail from non-executor", async function () {
      const delay = 48 * 3600;

      await expect(
        treasury.connect(approver1).scheduleTransaction(
          approver1.address,
          ethers.parseEther("1"),
          "0x",
          delay
        )
      ).to.be.reverted;
    });
  });

  describe("Transaction Approval", function () {
    let txId;

    beforeEach(async function () {
      const delay = 48 * 3600;
      const tx = await treasury.connect(executor).scheduleTransaction(
        approver1.address,
        ethers.parseEther("1"),
        "0x",
        delay
      );
      const receipt = await tx.wait();
      txId = 0; // First transaction
    });

    it("Should approve transaction", async function () {
      await expect(treasury.connect(approver1).approveTransaction(txId))
        .to.emit(treasury, "TransactionApproved")
        .withArgs(txId, approver1.address);

      expect(await treasury.hasApproved(txId, approver1.address)).to.be.true;
    });

    it("Should prevent double approval", async function () {
      await treasury.connect(approver1).approveTransaction(txId);

      await expect(
        treasury.connect(approver1).approveTransaction(txId)
      ).to.be.revertedWith("Treasury: already approved");
    });

    it("Should track approval count", async function () {
      await treasury.connect(approver1).approveTransaction(txId);
      await treasury.connect(approver2).approveTransaction(txId);

      const tx = await treasury.getTransaction(txId);
      expect(tx.approvalCount).to.equal(2);
    });
  });

  describe("Transaction Execution", function () {
    let txId;

    beforeEach(async function () {
      const delay = 2; // 2 seconds for testing
      const tx = await treasury.connect(executor).scheduleTransaction(
        approver1.address,
        ethers.parseEther("1"),
        "0x",
        delay
      );
      await tx.wait();
      txId = 0;

      // Get approvals
      await treasury.connect(approver1).approveTransaction(txId);
      await treasury.connect(approver2).approveTransaction(txId);
      await treasury.connect(approver3).approveTransaction(txId);
    });

    it("Should execute after timelock and approvals", async function () {
      await ethers.provider.send("evm_increaseTime", [3]);
      await ethers.provider.send("evm_mine");

      const balanceBefore = await ethers.provider.getBalance(approver1.address);

      await expect(treasury.connect(executor).executeTransaction(txId))
        .to.emit(treasury, "TransactionExecuted");

      const balanceAfter = await ethers.provider.getBalance(approver1.address);
      expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("1"));
    });

    it("Should fail without sufficient approvals", async function () {
      const delay = 2;
      const tx = await treasury.connect(executor).scheduleTransaction(
        approver1.address,
        ethers.parseEther("1"),
        "0x",
        delay
      );
      await tx.wait();
      const newTxId = 1;

      await treasury.connect(approver1).approveTransaction(newTxId);

      await ethers.provider.send("evm_increaseTime", [3]);
      await ethers.provider.send("evm_mine");

      await expect(
        treasury.connect(executor).executeTransaction(newTxId)
      ).to.be.revertedWith("Treasury: insufficient approvals");
    });

    it("Should fail before timelock expires", async function () {
      await expect(
        treasury.connect(executor).executeTransaction(txId)
      ).to.be.revertedWith("Treasury: timelock not expired");
    });

    it("Should prevent double execution", async function () {
      await ethers.provider.send("evm_increaseTime", [3]);
      await ethers.provider.send("evm_mine");

      await treasury.connect(executor).executeTransaction(txId);

      await expect(
        treasury.connect(executor).executeTransaction(txId)
      ).to.be.revertedWith("Treasury: already executed");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow emergency withdrawal by admin", async function () {
      const balanceBefore = await ethers.provider.getBalance(owner.address);

      await treasury.emergencyWithdraw(owner.address, ethers.parseEther("5"));

      const balanceAfter = await ethers.provider.getBalance(owner.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Should not allow non-admin emergency withdrawal", async function () {
      await expect(
        treasury.connect(approver1).emergencyWithdraw(
          approver1.address,
          ethers.parseEther("5")
        )
      ).to.be.reverted;
    });
  });
});

