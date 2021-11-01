import React, { useContext } from 'react'
import { useProviderReady } from '@/hooks/useProviderReady'
import { useNetworkReady } from '@/hooks/useNetworkReady'
import useFixupNetwork from '@/hooks/useFixupNetwork'

type Web3EnvContextType = {
  providerReady: boolean,
  networkReady: boolean | undefined,
  chainId: number | undefined,
}

const Web3EnvContext = React.createContext<Web3EnvContextType>({
  networkReady: false,
  providerReady: false,
  chainId: undefined,
})

const Web3EnvProvider: React.FC = ({ children }) => {
  const providerReady = useProviderReady()

  const [networkReady, chainId] = useNetworkReady()

  useFixupNetwork(networkReady)

  return (
    <Web3EnvContext.Provider value={{ providerReady, networkReady, chainId }}>
      {children}
    </Web3EnvContext.Provider>
  )
}

const useWeb3EnvContext = () => {
  return useContext(Web3EnvContext)
}

export { Web3EnvProvider, useWeb3EnvContext }
