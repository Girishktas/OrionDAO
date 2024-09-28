/**
 * Frontend constants for OrionDAO
 */

export const APP_NAME = "OrionDAO";
export const APP_DESCRIPTION = "Progressive consensus governance system";

export const VOTING_PERIOD_DAYS = 7;
export const TIMELOCK_HOURS = 48;

export const NETWORKS = {
  MAINNET: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/",
  },
  SEPOLIA: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/",
  },
  LOCALHOST: {
    chainId: 31337,
    name: "Localhost",
    rpcUrl: "http://127.0.0.1:8545",
  },
};

export const PROPOSAL_STATES = [
  "Draft",
  "Voting",
  "Finalization",
  "Execution",
  "Executed",
  "Rejected",
  "Cancelled",
];

export const MEMBER_ROLES = [
  "None",
  "Member",
  "Contributor",
  "Core",
  "Admin",
];

export const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
export const BLOCK_EXPLORER_URL = "https://etherscan.io";

