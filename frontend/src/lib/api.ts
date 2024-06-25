/**
 * API utilities for OrionDAO frontend
 */

import { IPFS_GATEWAY } from './constants';

/**
 * Upload data to IPFS using Pinata API
 */
export async function uploadToIPFS(data: any): Promise<string> {
  try {
    const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

    if (!pinataApiKey || !pinataSecretKey) {
      throw new Error("IPFS credentials not configured");
    }

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretKey,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: `OrionDAO-${Date.now()}`,
        },
      }),
    });

    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
}

/**
 * Fetch data from IPFS
 */
export async function fetchFromIPFS(hash: string): Promise<any> {
  try {
    const response = await fetch(`${IPFS_GATEWAY}${hash}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching from IPFS:", error);
    throw error;
  }
}

/**
 * Format proposal data for display
 */
export function formatProposalData(proposal: any) {
  return {
    ...proposal,
    createdAt: new Date(Number(proposal.createdAt) * 1000),
    votingStartTime: proposal.votingStartTime > 0 
      ? new Date(Number(proposal.votingStartTime) * 1000) 
      : null,
    votingEndTime: proposal.votingEndTime > 0 
      ? new Date(Number(proposal.votingEndTime) * 1000) 
      : null,
  };
}

/**
 * Calculate time remaining
 */
export function getTimeRemaining(endTime: Date): string {
  const now = new Date();
  const remaining = endTime.getTime() - now.getTime();

  if (remaining <= 0) return "Ended";

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  return `${hours}h remaining`;
}
