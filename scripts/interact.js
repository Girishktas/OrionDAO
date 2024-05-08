const hre = require("hardhat");
const fs = require("fs");

/**
 * Interactive script to interact with deployed contracts
 */
async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Interacting with contracts using:", signer.address);

  if (!fs.existsSync("deployment.json")) {
    console.error("deployment.json not found");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const contracts = deployment.contracts;

  // Get contract instances
  const orionToken = await hre.ethers.getContractAt("OrionToken", contracts.OrionToken);
  const proposalNFT = await hre.ethers.getContractAt("ProposalNFT", contracts.ProposalNFT);
  const daoRegistry = await hre.ethers.getContractAt("DAORegistry", contracts.DAORegistry);
  const reputationManager = await hre.ethers.getContractAt("ReputationManager", contracts.ReputationManager);
  const quadraticVoting = await hre.ethers.getContractAt("QuadraticVoting", contracts.QuadraticVoting);
  const treasury = await hre.ethers.getContractAt("Treasury", contracts.Treasury);

  console.log("\n=== Contract Status ===");
  
  // Check token balance
  const balance = await orionToken.balanceOf(signer.address);
  console.log(`ORION Balance: ${hre.ethers.formatEther(balance)} ORION`);

  // Check if member
  const isMember = await daoRegistry.isMember(signer.address);
  console.log(`DAO Member: ${isMember}`);

  if (isMember) {
    const role = await daoRegistry.getMemberRole(signer.address);
    const roleNames = ["None", "Member", "Contributor", "Core", "Admin"];
    console.log(`Role: ${roleNames[role]}`);

    const reputation = await reputationManager.getTotalScore(signer.address);
    console.log(`Reputation: ${reputation}`);
  }

  // Check proposal count
  const proposalCount = await proposalNFT.getTotalProposals();
  console.log(`Total Proposals: ${proposalCount}`);

  // Check treasury balance
  const treasuryBalance = await treasury.getBalance();
  console.log(`Treasury Balance: ${hre.ethers.formatEther(treasuryBalance)} ETH`);

  console.log("\n=== Available Actions ===");
  console.log("1. Create a proposal");
  console.log("2. Vote on a proposal");
  console.log("3. Check proposal status");
  console.log("4. Register new member");
  console.log("5. Update reputation");

  console.log("\nUse individual scripts for specific actions.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

