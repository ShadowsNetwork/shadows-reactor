import React, { useContext } from 'react'
import { useInitializeProvider } from '@/hooks/useInitializeProvider'
import { useNetworkReady } from '@/hooks/useNetworkReady'
import useRequiredChain from '@/hooks/useRequiredChain'
import useFixupNetwork from '@/hooks/useFixupNetwork'

type Web3EnvContextType = {
  providerInitialized: boolean,
  networkReady: boolean,
}

const Web3EnvContext = React.createContext<Web3EnvContextType>({
  networkReady: false,
  providerInitialized: false,
})

const Web3EnvProvider: React.FC = ({ children }) => {
  const requiredChain = useRequiredChain()

  const providerInitialized = useInitializeProvider(requiredChain)

  const networkReady = useNetworkReady(requiredChain)

  useFixupNetwork()

  return (
    <Web3EnvContext.Provider value={{ providerInitialized, networkReady }}>
      {children}
    </Web3EnvContext.Provider>
  )
}

const useWeb3EnvContext = () => {
  return useContext(Web3EnvContext)
}

export { Web3EnvProvider, useWeb3EnvContext }
