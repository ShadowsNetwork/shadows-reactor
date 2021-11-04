import { PolyChain } from '@/types/PolyChain'

import config from '@/config'

export function getPolyChainById(polyChainId: number): PolyChain | undefined {
  return config.bridge.polyChains.filter(c => c.polyChainId === polyChainId)?.[0]
}

export function getPolyChainByChainName(chainName: string): PolyChain | undefined {
  return config.bridge.polyChains.filter(c => c.ethereumChain.chainName === chainName)?.[0]
}

export function getToPolyChainByFromPolyChain(fromPolyChain: PolyChain): PolyChain {
  const polyChainId = config.bridge.polyChainId
  return fromPolyChain.polyChainId === polyChainId.Eth ? getPolyChainById(polyChainId.Bsc)! : getPolyChainById(polyChainId.Eth)!
}
