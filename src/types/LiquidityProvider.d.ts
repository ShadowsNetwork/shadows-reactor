export type PoolType = 'single' | 'pair'

export type PoolConfig = {
  poolNumber: number,
  poolName: string,
  poolType: PoolType,
  lpMultiplier: number,
  tokenName: string,
  leftCurrency?: {
    name: string,
    icon: any,
  },
  rightCurrency: {
    name: string,
    icon: any,
  },
  lpTokenContractAddress: string,
  farmContractAddress: string
}
