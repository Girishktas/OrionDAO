const hre = require("hardhat");
const fs = require("fs");

/**
 * Script to finalize voting on a proposal
 */
async function main() {
  console.log("Finalizing voting...");

  if (!fs.existsSync("deployment.json")) {
    console.error("deployment.json not found");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const quadraticVoting = await hre.ethers.getContractAt("QuadraticVoting", deployment.contracts.QuadraticVoting);
  const proposalNFT = await hre.ethers.getContractAt("ProposalNFT", deployment.contracts.ProposalNFT);

  const proposalId = process.argv[2] || 1;

  console.log("Proposal ID:", proposalId);

  const stateBefore = await proposalNFT.getProposalState(proposalId);
  console.log("State before:", stateBefore);

  console.log("\nFinalizing...");
  const tx = await quadraticVoting.finalizeVoting(proposalId);
  const receipt = await tx.wait();

  const stateAfter = await proposalNFT.getProposalState(proposalId);
  const result = await quadraticVoting.getVotingResult(proposalId);

  const stateNames = ["Draft", "Voting", "Finalization", "Execution", "Executed", "Rejected", "Cancelled"];

  console.log("\n✓ Voting finalized!");
  console.log("Transaction hash:", receipt.hash);
  console.log("New state:", stateNames[stateAfter]);
  console.log("\nResults:");
  console.log("Support:", result.totalSupport.toString());
  console.log("Against:", result.totalAgainst.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

