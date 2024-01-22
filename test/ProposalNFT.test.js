const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProposalNFT", function () {
  let proposalNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ProposalNFT = await ethers.getContractFactory("ProposalNFT");
    proposalNFT = await ProposalNFT.deploy();
    await proposalNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await proposalNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await proposalNFT.name()).to.equal("OrionDAO Proposal");
      expect(await proposalNFT.symbol()).to.equal("ORION-PROP");
    });
  });

  describe("Proposal Creation", function () {
    it("Should create a proposal successfully", async function () {
      const title = "Test Proposal";
      const description = "This is a test proposal";
      const ipfsHash = "QmTestHash123";

      await expect(proposalNFT.connect(addr1).createProposal(title, description, ipfsHash))
        .to.emit(proposalNFT, "ProposalCreated")
        .withArgs(1, addr1.address, title, ipfsHash);

      const proposal = await proposalNFT.getProposal(1);
      expect(proposal.title).to.equal(title);
      expect(proposal.description).to.equal(description);
      expect(proposal.proposer).to.equal(addr1.address);
    });

    it("Should fail with empty title", async function () {
      await expect(
        proposalNFT.createProposal("", "Description", "QmHash")
      ).to.be.revertedWith("ProposalNFT: title cannot be empty");
    });

    it("Should fail with empty IPFS hash", async function () {
      await expect(
        proposalNFT.createProposal("Title", "Description", "")
      ).to.be.revertedWith("ProposalNFT: IPFS hash required");
    });

    it("Should mint NFT to proposer", async function () {
      await proposalNFT.connect(addr1).createProposal("Title", "Desc", "QmHash");
      expect(await proposalNFT.ownerOf(1)).to.equal(addr1.address);
    });
  });

  describe("State Management", function () {
    beforeEach(async function () {
      await proposalNFT.connect(addr1).createProposal("Title", "Desc", "QmHash");
      await proposalNFT.setVotingContract(owner.address);
    });

    it("Should update proposal state", async function () {
      await expect(proposalNFT.updateProposalState(1, 1))
        .to.emit(proposalNFT, "ProposalStateChanged")
        .withArgs(1, 0, 1);

      expect(await proposalNFT.getProposalState(1)).to.equal(1);
    });

    it("Should prevent invalid state transitions", async function () {
      await expect(
        proposalNFT.updateProposalState(1, 3)
      ).to.be.revertedWith("ProposalNFT: invalid state transition");
    });
  });

  describe("NFT Transfer Prevention", function () {
    it("Should prevent NFT transfers", async function () {
      await proposalNFT.connect(addr1).createProposal("Title", "Desc", "QmHash");
      
      await expect(
        proposalNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 1)
      ).to.be.revertedWith("ProposalNFT: proposals are non-transferable");
    });
  });
});

