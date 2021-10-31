import { EthereumChain } from '@/ShadowsJs/networkHelper'

export type PolyChain = {
  polyChainId: number
  ethereumChain: EthereumChain
  explorerUrl: string
  lockContractAddress: string
  dowsTokenAddress: string
  icon: any
}
