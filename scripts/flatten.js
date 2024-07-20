const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Script to flatten contracts for verification
 */
async function main() {
  console.log("Flattening contracts...\n");

  const contracts = [
    "contracts/OrionToken.sol",
    "contracts/core/ProposalNFT.sol",
    "contracts/core/DAORegistry.sol",
    "contracts/core/ReputationManager.sol",
    "contracts/core/QuadraticVoting.sol",
    "contracts/core/Treasury.sol",
  ];

  const outputDir = "./flattened";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const contractPath of contracts) {
    console.log(`Flattening ${contractPath}...`);
    
    const flattened = await hre.run("flatten:get-flattened-sources", {
      files: [contractPath],
    });

    const contractName = path.basename(contractPath, ".sol");
    const outputPath = path.join(outputDir, `${contractName}_flat.sol`);

    fs.writeFileSync(outputPath, flattened);
    console.log(`  ✓ Saved to ${outputPath}`);
  }

  console.log("\n✓ All contracts flattened successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

