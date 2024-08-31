const hre = require("hardhat");
const fs = require("fs");

/**
 * Script to check proposal status
 */
async function main() {
  console.log("Checking proposal status...\n");

  if (!fs.existsSync("deployment.json")) {
    console.error("deployment.json not found");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const proposalNFT = await hre.ethers.getContractAt("ProposalNFT", deployment.contracts.ProposalNFT);
  const quadraticVoting = await hre.ethers.getContractAt("QuadraticVoting", deployment.contracts.QuadraticVoting);

  const proposalId = process.argv[2] || 1;

  const proposal = await proposalNFT.getProposal(proposalId);
  const result = await quadraticVoting.getVotingResult(proposalId);

  const stateNames = ["Draft", "Voting", "Finalization", "Execution", "Executed", "Rejected", "Cancelled"];

  console.log("=== Proposal #" + proposalId + " ===");
  console.log("Title:", proposal.title);
  console.log("Proposer:", proposal.proposer);
  console.log("State:", stateNames[proposal.state]);
  console.log("\n=== Voting Results ===");
  console.log("Total Support:", result.totalSupport.toString());
  console.log("Total Against:", result.totalAgainst.toString());
  console.log("Participants:", result.participantCount.toString());
  console.log("Quorum Reached:", result.quorumReached);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

