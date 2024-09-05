const hre = require("hardhat");
const fs = require("fs");

/**
 * Script to register a new DAO member
 */
async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Registering member with account:", signer.address);

  if (!fs.existsSync("deployment.json")) {
    console.error("deployment.json not found");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const daoRegistry = await hre.ethers.getContractAt("DAORegistry", deployment.contracts.DAORegistry);
  const reputationManager = await hre.ethers.getContractAt("ReputationManager", deployment.contracts.ReputationManager);

  const memberAddress = process.argv[2] || signer.address;
  const role = process.argv[3] || 1; // Default: Member

  const roleNames = ["None", "Member", "Contributor", "Core", "Admin"];

  console.log("\nRegistration Details:");
  console.log("Address:", memberAddress);
  console.log("Role:", roleNames[role]);

  console.log("\nRegistering member...");
  let tx = await daoRegistry.registerMember(memberAddress, role);
  await tx.wait();

  console.log("Initializing reputation...");
  tx = await reputationManager.initializeReputation(memberAddress);
  await tx.wait();

  console.log("\n✓ Member registered successfully!");
  
  const member = await daoRegistry.getMember(memberAddress);
  console.log("Member role:", roleNames[member.role]);
  console.log("Active:", member.isActive);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

