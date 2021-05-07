import { PoolConfig } from '@/types/LiquidityProvider'
import { PolyChain } from '@/types/PolyChain'

export type ConfigType = {
  liquidityProvider: {
    supportedPools: PoolConfig[]
  },
  bridge: BridgeConfig
}

export type BridgeConfig = {
  apiBaseUrl: string,
  polyChainExplorerUrl: string,
  polyChains: PolyChain[],
  polyChainId: {
    Eth: number,
    Bsc: number
  }
}
