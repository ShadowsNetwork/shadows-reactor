import React, { useContext } from 'react'
import { useInitializeProvider } from '@/hooks/useInitializeProvider'
import { useNetworkReady } from '@/hooks/useNetworkReady'
import useFixupNetwork from '@/hooks/useFixupNetwork'

type Web3EnvContextType = {
  providerInitialized: boolean,
  networkReady: boolean | undefined,
}

const Web3EnvContext = React.createContext<Web3EnvContextType>({
  networkReady: false,
  providerInitialized: false,
})

const Web3EnvProvider: React.FC = ({ children }) => {
  const providerInitialized = useInitializeProvider()

  const networkReady = useNetworkReady()

  useFixupNetwork(networkReady)

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
