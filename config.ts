import { PoolConfig } from '@/types/LiquidityProvider'
import { PolyChain } from '@/types/PolyChain'
import { EthereumChain } from '@/ShadowsJs/networkHelper'

export type ConfigType = {
  liquidityProvider: {
    supportedPools: PoolConfig[]
  },
  bridge: BridgeConfig,
  baseUrl: string
  ethChain: EthereumChain
}

export type BridgeConfig = {
  apiBaseUrl: string,
  polyChainExplorerUrl: string,
  polyChains: PolyChain[],
  polyChainId: {
    Eth: number,
    Bsc: number
  },
  ethChain: EthereumChain
}
