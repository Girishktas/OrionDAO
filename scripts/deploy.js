const hre = require("hardhat");

async function main() {
  console.log("Starting OrionDAO deployment...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy OrionToken
  console.log("\n1. Deploying OrionToken...");
  const OrionToken = await hre.ethers.getContractFactory("OrionToken");
  const orionToken = await OrionToken.deploy();
  await orionToken.waitForDeployment();
  const orionTokenAddress = await orionToken.getAddress();
  console.log("OrionToken deployed to:", orionTokenAddress);

  // Deploy ProposalNFT
  console.log("\n2. Deploying ProposalNFT...");
  const ProposalNFT = await hre.ethers.getContractFactory("ProposalNFT");
  const proposalNFT = await ProposalNFT.deploy();
  await proposalNFT.waitForDeployment();
  const proposalNFTAddress = await proposalNFT.getAddress();
  console.log("ProposalNFT deployed to:", proposalNFTAddress);

  // Deploy DAORegistry
  console.log("\n3. Deploying DAORegistry...");
  const DAORegistry = await hre.ethers.getContractFactory("DAORegistry");
  const daoRegistry = await DAORegistry.deploy();
  await daoRegistry.waitForDeployment();
  const daoRegistryAddress = await daoRegistry.getAddress();
  console.log("DAORegistry deployed to:", daoRegistryAddress);

  // Deploy ReputationManager
  console.log("\n4. Deploying ReputationManager...");
  const ReputationManager = await hre.ethers.getContractFactory("ReputationManager");
  const reputationManager = await ReputationManager.deploy();
  await reputationManager.waitForDeployment();
  const reputationManagerAddress = await reputationManager.getAddress();
  console.log("ReputationManager deployed to:", reputationManagerAddress);

  // Deploy QuadraticVoting
  console.log("\n5. Deploying QuadraticVoting...");
  const QuadraticVoting = await hre.ethers.getContractFactory("QuadraticVoting");
  const quadraticVoting = await QuadraticVoting.deploy(
    orionTokenAddress,
    proposalNFTAddress,
    reputationManagerAddress
  );
  await quadraticVoting.waitForDeployment();
  const quadraticVotingAddress = await quadraticVoting.getAddress();
  console.log("QuadraticVoting deployed to:", quadraticVotingAddress);

  // Deploy Treasury
  console.log("\n6. Deploying Treasury...");
  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(proposalNFTAddress);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("Treasury deployed to:", treasuryAddress);

  // Configure contracts
  console.log("\n7. Configuring contracts...");
  
  console.log("Setting voting contract in ProposalNFT...");
  await proposalNFT.setVotingContract(quadraticVotingAddress);
  
  console.log("Setting treasury contract in ProposalNFT...");
  await proposalNFT.setTreasuryContract(treasuryAddress);

  // Print deployment summary
  console.log("\n========================================");
  console.log("Deployment Summary");
  console.log("========================================");
  console.log("OrionToken:", orionTokenAddress);
  console.log("ProposalNFT:", proposalNFTAddress);
  console.log("DAORegistry:", daoRegistryAddress);
  console.log("ReputationManager:", reputationManagerAddress);
  console.log("QuadraticVoting:", quadraticVotingAddress);
  console.log("Treasury:", treasuryAddress);
  console.log("========================================");

  // Save deployment addresses
  const fs = require("fs");
  const deploymentData = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      OrionToken: orionTokenAddress,
      ProposalNFT: proposalNFTAddress,
      DAORegistry: daoRegistryAddress,
      ReputationManager: reputationManagerAddress,
      QuadraticVoting: quadraticVotingAddress,
      Treasury: treasuryAddress
    }
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentData, null, 2)
  );
  console.log("\nDeployment addresses saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

