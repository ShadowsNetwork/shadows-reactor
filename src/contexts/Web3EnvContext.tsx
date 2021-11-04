import React, { useContext, useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import useRequiredChain from '@/hooks/useRequiredChain'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import ContractSettings from '@/ShadowsJs/ContractSettings'
import { DEFAULT_PROVIDER } from '@/web3/connectors'
import { useEagerConnect } from '@/hooks/useEagerConnect'
import { message } from 'antd'

type Web3EnvContextType = {
  providerReady: boolean,
  networkReady: boolean | undefined,
}

const Web3EnvContext = React.createContext<Web3EnvContextType>({
  networkReady: false,
  providerReady: false,
})

const Web3EnvProvider: React.FC = ({ children }) => {
  const requiredChain = useRequiredChain()
  const { chainId, account, library, error, deactivate } = useWeb3React()
  useEagerConnect()

  useEffect(() => {
    if (error) {
      deactivate()

      if (requiredChain && error.toString().includes('Error: Invariant failed: chainId Binance-Chain-')) {
        message.error(`Please manually switch the network to ${requiredChain.chainName} in Binance Chain Wallet`)
      } else {
        message.error(error)
      }
    }
  }, [error, requiredChain])

  const networkReady = useMemo<boolean>(() => {
    if (error) {
      return false
    }

    return requiredChain !== undefined && chainId === parseInt(requiredChain.chainId, 16)
  }, [chainId, requiredChain, error])

  const providerReady = useMemo<boolean>(() => {
    if (!requiredChain) {
      return false
    }

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
    <Web3EnvContext.Provider value={{ providerReady, networkReady }}>
      {children}
    </Web3EnvContext.Provider>
  )
}

const useWeb3EnvContext = () => {
  return useContext(Web3EnvContext)
}

export { Web3EnvProvider, useWeb3EnvContext }
