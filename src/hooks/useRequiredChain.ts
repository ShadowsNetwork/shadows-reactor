import {
  EthereumChain, getEthereumChainById, SupportedEthereumChainId
} from '@/ShadowsJs/networkHelper'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getSourcePolyChainId } from '@/store/bridge'
import { getPolyChainById } from '@/utils/bridgeUtils'
import { persistor } from '@/store'
import { useMemo } from 'react'

const useRequiredChain = (): EthereumChain | undefined => {
  const chainIdFromEnv = process.env.CHAIN_ID as SupportedEthereumChainId

  const location = useLocation()

  const sourcePolyChainId = useSelector(getSourcePolyChainId)

  return useMemo(() => {
    if (location.pathname.startsWith('/bridge')) {
      const polyChain = getPolyChainById(sourcePolyChainId)
      if (!polyChain) {
        persistor.purge()
        window.location.reload()
        return undefined
      }

      return polyChain.ethereumChain
    } else {
      return getEthereumChainById(chainIdFromEnv)!
    }
  }, [location, sourcePolyChainId])

}

export default useRequiredChain
