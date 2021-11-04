import { EthereumChain } from '@/web3/network'

export type PolyChain = {
  polyChainId: number
  ethereumChain: EthereumChain
  explorerUrl: string
  lockContractAddress: string
  dowsTokenAddress: string
  icon: any
}
