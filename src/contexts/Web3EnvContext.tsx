import React, { useContext, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import useRequiredChain from '@/hooks/useRequiredChain'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import ContractSettings from '@/ShadowsJs/ContractSettings'
import { DEFAULT_PROVIDER } from '@/web3/connectors'
import { useEagerConnect } from '@/hooks/useEagerConnect'

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
  const requiredChain = useRequiredChain()

  const { chainId, account, library } = useWeb3React()
  useEagerConnect()

  const networkReady = useMemo(() => {
    return requiredChain !== undefined && chainId === parseInt(requiredChain.chainId, 16)
  }, [chainId, requiredChain])

  const providerReady = useMemo(() => {
    if (networkReady && library && chainId && account) {
      dowsJSConnector.setContractSettings(
        new ContractSettings(
          library,
          library.getSigner(account),
          `0x${chainId.toString(16)}`
        )
      )

      return true
    }

    if (!requiredChain) {
      return false
    }

    dowsJSConnector.setContractSettings(
      new ContractSettings(
        DEFAULT_PROVIDER,
        undefined,
        requiredChain.chainId
      )
    )

    return true
  }, [library, chainId, account, requiredChain, networkReady])

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
