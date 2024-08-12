/**
 * Custom React hooks for OrionDAO
 */

import { useAccount, useContractRead } from 'wagmi';
import { CONTRACTS } from './contracts';

/**
 * Hook to check if user is a DAO member
 */
export function useIsMember() {
  const { address } = useAccount();
  
  const { data: isMember, isLoading } = useContractRead({
    address: CONTRACTS.DAORegistry.address as `0x${string}`,
    abi: CONTRACTS.DAORegistry.abi,
    functionName: 'isMember',
    args: [address],
    enabled: !!address,
  });

  return { isMember: isMember as boolean, isLoading };
}

/**
 * Hook to get user's ORION token balance
 */
export function useTokenBalance() {
  const { address } = useAccount();
  
  const { data: balance, isLoading } = useContractRead({
    address: CONTRACTS.OrionToken.address as `0x${string}`,
    abi: CONTRACTS.OrionToken.abi,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  return { balance: balance as bigint, isLoading };
}

/**
 * Hook to get user's reputation score
 */
export function useReputation() {
  const { address } = useAccount();
  
  const { data: reputation, isLoading } = useContractRead({
    address: CONTRACTS.ReputationManager.address as `0x${string}`,
    abi: CONTRACTS.ReputationManager.abi,
    functionName: 'getTotalScore',
    args: [address],
    enabled: !!address,
  });

  return { reputation: reputation as bigint, isLoading };
}

