/**
 * Utility functions for the OrionDAO frontend
 */

/**
 * Truncates an Ethereum address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Formats a large number with commas
 */
export function formatNumber(num: number | string): string {
  return Number(num).toLocaleString();
}

/**
 * Converts Wei to Ether
 */
export function weiToEther(wei: bigint): string {
  return (Number(wei) / 1e18).toFixed(4);
}

/**
 * Converts Ether to Wei
 */
export function etherToWei(ether: string): bigint {
  return BigInt(Math.floor(Number(ether) * 1e18));
}

/**
 * Formats a timestamp to a readable date
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Calculates time remaining until a deadline
 */
export function getTimeRemaining(endTime: number): string {
  const now = Math.floor(Date.now() / 1000);
  const remaining = endTime - now;

  if (remaining <= 0) return 'Ended';

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

/**
 * Validates Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Calculates quadratic voting cost
 */
export function calculateVoteCost(voteCount: number, reputation: number = 100): number {
  const baseCost = voteCount * voteCount;
  const reputationDiscount = reputation > 100 ? reputation / 100 : 1;
  return Math.floor(baseCost / reputationDiscount);
}

