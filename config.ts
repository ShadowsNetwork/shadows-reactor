import { PoolConfig } from '@/types/LiquidityProvider'

export type ConfigType = {
  liquidityProvider: {
    supportedPools: PoolConfig[]
  }
}
