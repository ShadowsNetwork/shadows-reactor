import { EthereumChainParams } from '@/ShadowsJs/networkHelper'

export type PolyChain = {
  polyChainId: number
  ethereumChain: EthereumChainParams
  explorerUrl: string
  lockContractAddress: string
  dowsTokenAddress: string
  icon: any
}
