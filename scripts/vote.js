const hre = require("hardhat");
const fs = require("fs");

/**
 * Script to cast a vote on a proposal
 */
async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Voting with account:", signer.address);

  if (!fs.existsSync("deployment.json")) {
    console.error("deployment.json not found");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const orionToken = await hre.ethers.getContractAt("OrionToken", deployment.contracts.OrionToken);
  const quadraticVoting = await hre.ethers.getContractAt("QuadraticVoting", deployment.contracts.QuadraticVoting);

  const proposalId = process.argv[2] || 1;
  const voteCount = process.argv[3] || 5;
  const support = process.argv[4] !== "false";

  console.log("\nVote Details:");
  console.log("Proposal ID:", proposalId);
  console.log("Vote Count:", voteCount);
  console.log("Support:", support);

  const voteCost = await quadraticVoting.calculateVoteCost(voteCount, 100);
  console.log("Vote Cost:", hre.ethers.formatEther(voteCost), "ORION");

  console.log("\nApproving token spending...");
  let tx = await orionToken.approve(deployment.contracts.QuadraticVoting, voteCost);
  await tx.wait();

  console.log("Casting vote...");
  tx = await quadraticVoting.castVote(proposalId, voteCount, support);
  const receipt = await tx.wait();

  console.log("\n✓ Vote cast successfully!");
  console.log("Transaction hash:", receipt.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

