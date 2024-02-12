// Contract addresses and ABIs
export const CONTRACTS = {
  OrionToken: {
    address: process.env.NEXT_PUBLIC_ORION_TOKEN_ADDRESS || '',
    abi: [] // ABI will be imported from artifacts
  },
  ProposalNFT: {
    address: process.env.NEXT_PUBLIC_PROPOSAL_NFT_ADDRESS || '',
    abi: []
  },
  QuadraticVoting: {
    address: process.env.NEXT_PUBLIC_QUADRATIC_VOTING_ADDRESS || '',
    abi: []
  },
  ReputationManager: {
    address: process.env.NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS || '',
    abi: []
  },
  Treasury: {
    address: process.env.NEXT_PUBLIC_TREASURY_ADDRESS || '',
    abi: []
  },
  DAORegistry: {
    address: process.env.NEXT_PUBLIC_DAO_REGISTRY_ADDRESS || '',
    abi: []
  }
};

export type ContractName = keyof typeof CONTRACTS;

