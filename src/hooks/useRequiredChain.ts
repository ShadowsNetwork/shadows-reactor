import {
  EthereumChain, getEthereumChainById, SupportedEthereumChainId
} from '@/ShadowsJs/networkHelper'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getSourcePolyChainId } from '@/store/bridge'
import { getPolyChainById } from '@/utils/bridgeUtils'

const useRequiredChain = (): EthereumChain | undefined => {
  const chainIdFromEnv = process.env.CHAIN_ID as SupportedEthereumChainId

  const location = useLocation()

  const sourcePolyChainId = useSelector(getSourcePolyChainId)

  if (location.pathname.startsWith('/bridge')) {
    const polyChain = getPolyChainById(sourcePolyChainId)
    return polyChain!.ethereumChain
  } else {
    return getEthereumChainById(chainIdFromEnv)!
  }

}

export default useRequiredChain
