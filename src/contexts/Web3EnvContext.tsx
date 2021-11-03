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

  const providerReady = useMemo(() => {
    if (!(library && account) && requiredChain) {
      dowsJSConnector.setContractSettings(
        new ContractSettings(
          DEFAULT_PROVIDER,
          undefined,
          parseInt(requiredChain.chainId, 16)
        )
      )

      return true
    }


    const provider = library
    const signer = library.getSigner(account)

    console.log(provider, signer)

    dowsJSConnector.setContractSettings(
      new ContractSettings(
        provider,
        signer,
        chainId
      )
    )

    return true
  }, [library, chainId, account, requiredChain])

  const networkReady = useMemo(() => {
    return requiredChain && chainId === parseInt(requiredChain.chainId, 16)
  }, [chainId, requiredChain])


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
