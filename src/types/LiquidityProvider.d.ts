export type PoolType = 'single' | 'pair'

export type PoolConfig = {
  poolNumber: number,
  poolName: string,
  poolType: PoolType,
  lpMultiplier: number,
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
