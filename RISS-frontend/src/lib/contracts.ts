export const RISS_REPUTATION_ADDRESS = import.meta.env.VITE_RISS_REPUTATION_ADDRESS as string | undefined

export const RISS_REPUTATION_ABI = [
  'function getReputationScore(address _user) view returns (uint256 total, uint256 identity, uint256 contribution, uint256 trust, uint256 social, uint256 engagement, uint256 lastUpdated)',
] as const
