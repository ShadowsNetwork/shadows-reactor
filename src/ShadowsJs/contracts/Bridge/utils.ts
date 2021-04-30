import { POLY_CHAINS, PolyChain, PolyChainId } from '@/ShadowsJs/contracts/Bridge/constant'

export function getPolyChainById(polyChainId: number): PolyChain | undefined {
  return POLY_CHAINS.filter(c => c.polyChainId === polyChainId)?.[0]
}

export function getPolyChainByNetworkChainId(networkChainId: number): PolyChain | undefined {
  return POLY_CHAINS.filter(c => c.networkChainId === networkChainId)?.[0]
}

export function getToPolyChainByFromPolyChain(fromPolyChain: PolyChain): PolyChain {
  return fromPolyChain.polyChainId === PolyChainId.Eth ? getPolyChainById(PolyChainId.Bsc)! : getPolyChainById(PolyChainId.Eth)!
}
