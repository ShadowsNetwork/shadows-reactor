export type PoolConfig = {
  poolNumber: number,
  poolName: string,
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
