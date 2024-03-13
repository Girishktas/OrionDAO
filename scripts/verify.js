const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting contract verification...");

  // Load deployment data
  if (!fs.existsSync("deployment.json")) {
    console.error("deployment.json not found. Please deploy contracts first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const contracts = deployment.contracts;

  // Verify OrionToken
  console.log("\n1. Verifying OrionToken...");
  try {
    await hre.run("verify:verify", {
      address: contracts.OrionToken,
      constructorArguments: [],
    });
    console.log("✓ OrionToken verified");
  } catch (error) {
    console.log("× OrionToken verification failed:", error.message);
  }

  // Verify ProposalNFT
  console.log("\n2. Verifying ProposalNFT...");
  try {
    await hre.run("verify:verify", {
      address: contracts.ProposalNFT,
      constructorArguments: [],
    });
    console.log("✓ ProposalNFT verified");
  } catch (error) {
    console.log("× ProposalNFT verification failed:", error.message);
  }

  // Verify DAORegistry
  console.log("\n3. Verifying DAORegistry...");
  try {
    await hre.run("verify:verify", {
      address: contracts.DAORegistry,
      constructorArguments: [],
    });
    console.log("✓ DAORegistry verified");
  } catch (error) {
    console.log("× DAORegistry verification failed:", error.message);
  }

  // Verify ReputationManager
  console.log("\n4. Verifying ReputationManager...");
  try {
    await hre.run("verify:verify", {
      address: contracts.ReputationManager,
      constructorArguments: [],
    });
    console.log("✓ ReputationManager verified");
  } catch (error) {
    console.log("× ReputationManager verification failed:", error.message);
  }

  // Verify QuadraticVoting
  console.log("\n5. Verifying QuadraticVoting...");
  try {
    await hre.run("verify:verify", {
      address: contracts.QuadraticVoting,
      constructorArguments: [
        contracts.OrionToken,
        contracts.ProposalNFT,
        contracts.ReputationManager,
      ],
    });
    console.log("✓ QuadraticVoting verified");
  } catch (error) {
    console.log("× QuadraticVoting verification failed:", error.message);
  }

  // Verify Treasury
  console.log("\n6. Verifying Treasury...");
  try {
    await hre.run("verify:verify", {
      address: contracts.Treasury,
      constructorArguments: [contracts.ProposalNFT],
    });
    console.log("✓ Treasury verified");
  } catch (error) {
    console.log("× Treasury verification failed:", error.message);
  }

  console.log("\nVerification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

