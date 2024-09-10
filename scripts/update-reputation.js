const hre = require("hardhat");
const fs = require("fs");

/**
 * Script to update reputation scores
 */
async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Updating reputation with account:", signer.address);

  if (!fs.existsSync("deployment.json")) {
    console.error("deployment.json not found");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const reputationManager = await hre.ethers.getContractAt("ReputationManager", deployment.contracts.ReputationManager);

  const userAddress = process.argv[2] || signer.address;
  const participationDelta = process.argv[3] || 50;
  const accuracyDelta = process.argv[4] || 100;
  const contributionDelta = process.argv[5] || 75;

  console.log("\nUpdate Details:");
  console.log("User:", userAddress);
  console.log("Participation Delta:", participationDelta);
  console.log("Accuracy Delta:", accuracyDelta);
  console.log("Contribution Delta:", contributionDelta);

  const beforeScore = await reputationManager.getTotalScore(userAddress);
  console.log("\nBefore Score:", beforeScore.toString());

  console.log("\nUpdating reputation...");
  const tx = await reputationManager.updateReputation(
    userAddress,
    participationDelta,
    accuracyDelta,
    contributionDelta
  );
  await tx.wait();

  const afterScore = await reputationManager.getTotalScore(userAddress);
  console.log("After Score:", afterScore.toString());
  console.log("\n✓ Reputation updated successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

