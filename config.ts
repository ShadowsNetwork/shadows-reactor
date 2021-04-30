import { PoolConfig } from '@/types/LiquidityProvider'

export type ConfigType = {
  liquidityProvider: {
    supportedPools: PoolConfig[]
  },
  bridge: {
    apiBaseUrl: string,
    ethereumChainId: number,
    binanceSmartChainId: number
  }
}
