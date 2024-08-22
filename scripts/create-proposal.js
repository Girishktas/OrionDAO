const hre = require("hardhat");
const fs = require("fs");

/**
 * Script to create a proposal
 */
async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Creating proposal with account:", signer.address);

  if (!fs.existsSync("deployment.json")) {
    console.error("deployment.json not found");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const proposalNFT = await hre.ethers.getContractAt("ProposalNFT", deployment.contracts.ProposalNFT);

  const title = "Example Proposal";
  const description = "This is an example proposal created via script";
  const ipfsHash = "QmExampleHash123456789";

  console.log("\nCreating proposal...");
  console.log("Title:", title);
  console.log("IPFS Hash:", ipfsHash);

  const tx = await proposalNFT.createProposal(title, description, ipfsHash);
  const receipt = await tx.wait();

  console.log("\n✓ Proposal created!");
  console.log("Transaction hash:", receipt.hash);
  
  const proposalCount = await proposalNFT.getTotalProposals();
  console.log("Total proposals:", proposalCount.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

