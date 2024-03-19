const hre = require("hardhat");
const fs = require("fs");

/**
 * Seed script to populate contracts with sample data for testing
 */
async function main() {
  console.log("Starting seed process...");

  const [deployer, user1, user2, user3] = await hre.ethers.getSigners();

  // Load deployment addresses
  if (!fs.existsSync("deployment.json")) {
    console.error("deployment.json not found");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const contracts = deployment.contracts;

  // Get contract instances
  const orionToken = await hre.ethers.getContractAt("OrionToken", contracts.OrionToken);
  const daoRegistry = await hre.ethers.getContractAt("DAORegistry", contracts.DAORegistry);
  const reputationManager = await hre.ethers.getContractAt("ReputationManager", contracts.ReputationManager);
  const proposalNFT = await hre.ethers.getContractAt("ProposalNFT", contracts.ProposalNFT);

  // Distribute tokens
  console.log("\n1. Distributing ORION tokens...");
  await orionToken.transfer(user1.address, hre.ethers.parseEther("10000"));
  await orionToken.transfer(user2.address, hre.ethers.parseEther("10000"));
  await orionToken.transfer(user3.address, hre.ethers.parseEther("10000"));
  console.log("✓ Tokens distributed");

  // Register members
  console.log("\n2. Registering DAO members...");
  await daoRegistry.registerMember(user1.address, 1); // Member
  await daoRegistry.registerMember(user2.address, 2); // Contributor
  await daoRegistry.registerMember(user3.address, 3); // Core
  console.log("✓ Members registered");

  // Initialize reputations
  console.log("\n3. Initializing reputations...");
  await reputationManager.initializeReputation(user1.address);
  await reputationManager.initializeReputation(user2.address);
  await reputationManager.initializeReputation(user3.address);
  console.log("✓ Reputations initialized");

  // Create sample proposals
  console.log("\n4. Creating sample proposals...");
  await proposalNFT.connect(user1).createProposal(
    "Increase Treasury Allocation",
    "Proposal to allocate 100 ETH to marketing fund",
    "QmSampleHash1"
  );
  await proposalNFT.connect(user2).createProposal(
    "Implement New Feature",
    "Add cross-chain bridge functionality",
    "QmSampleHash2"
  );
  await proposalNFT.connect(user3).createProposal(
    "Change Governance Parameters",
    "Reduce voting period to 5 days",
    "QmSampleHash3"
  );
  console.log("✓ Sample proposals created");

  console.log("\n✓ Seed complete!");
  console.log("\nSummary:");
  console.log("- 3 users with ORION tokens");
  console.log("- 3 registered DAO members");
  console.log("- 3 initialized reputations");
  console.log("- 3 sample proposals");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

