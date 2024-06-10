const hre = require("hardhat");

/**
 * Gas analysis script for contract operations
 */
async function main() {
  console.log("Starting gas analysis...\n");

  const [deployer] = await hre.ethers.getSigners();

  // Deploy contracts for testing
  console.log("Deploying contracts for gas analysis...");
  
  const OrionToken = await hre.ethers.getContractFactory("OrionToken");
  const orionToken = await OrionToken.deploy();
  await orionToken.waitForDeployment();

  const ProposalNFT = await hre.ethers.getContractFactory("ProposalNFT");
  const proposalNFT = await ProposalNFT.deploy();
  await proposalNFT.waitForDeployment();

  const DAORegistry = await hre.ethers.getContractFactory("DAORegistry");
  const daoRegistry = await DAORegistry.deploy();
  await daoRegistry.waitForDeployment();

  console.log("\n=== Gas Usage Analysis ===\n");

  // Test OrionToken operations
  console.log("OrionToken:");
  let tx = await orionToken.transfer(deployer.address, hre.ethers.parseEther("100"));
  let receipt = await tx.wait();
  console.log(`  transfer(): ${receipt.gasUsed.toString()} gas`);

  tx = await orionToken.mint(deployer.address, hre.ethers.parseEther("1000"));
  receipt = await tx.wait();
  console.log(`  mint(): ${receipt.gasUsed.toString()} gas`);

  // Test ProposalNFT operations
  console.log("\nProposalNFT:");
  tx = await proposalNFT.createProposal("Test", "Description", "QmHash");
  receipt = await tx.wait();
  console.log(`  createProposal(): ${receipt.gasUsed.toString()} gas`);

  // Test DAORegistry operations
  console.log("\nDAORegistry:");
  tx = await daoRegistry.registerMember(deployer.address, 1);
  receipt = await tx.wait();
  console.log(`  registerMember(): ${receipt.gasUsed.toString()} gas`);

  console.log("\n=== Analysis Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

