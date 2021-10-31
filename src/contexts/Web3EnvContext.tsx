import React, { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setChainId, setRpcUrl } from '../store/wallet'
import { useInitializeProvider, useSetupNetwork } from '../hooks'
import { EthereumChain, getEthereumChainById } from '@/ShadowsJs/networkHelper'
import useStoredWallet from '@/store/wallet/useStoredWallet'
import { useLocation } from 'react-router-dom'

type Web3EnvContextType = {
  providerInitialized: boolean,
  networkReady: boolean,
  setup: (_params: EthereumChain) => void
}

const Web3EnvContext = React.createContext<Web3EnvContextType>({
  networkReady: false,
  providerInitialized: false,
  setup(_params: EthereumChain): void { return }
})

const Web3EnvProvider: React.FC = ({ children }) => {
  const location = useLocation()

  const dispatch = useDispatch()

  const { RPCUrl, chainId } = useStoredWallet()

  const setup: Web3EnvContextType['setup'] = (params: EthereumChain) => {
    dispatch(setChainId(params.chainId))
    dispatch(setRpcUrl(params.rpcUrls[0]))
  }

  useEffect(() => {
    if (location.pathname.startsWith('/bridge')) {
      return
    }

    const _rpcUrl = process.env.RPC_URL!
    const _chainId = process.env.CHAIN_ID!

    dispatch(setRpcUrl(_rpcUrl))
    dispatch(setChainId(_chainId))
  }, [location])

  useEffect(() => {
    if (!RPCUrl) {
      dispatch(setRpcUrl(process.env.RPC_URL!))
    }

    if (!chainId) {
      dispatch(setChainId(process.env.CHAIN_ID!))
    }
  }, [RPCUrl, chainId])

  const providerInitialized = useInitializeProvider(chainId, RPCUrl)

  const networkReady = useSetupNetwork(providerInitialized, getEthereumChainById(chainId))

  return <Web3EnvContext.Provider value={{ providerInitialized, networkReady, setup }}>{children}</Web3EnvContext.Provider>
}

const useWeb3EnvContext = () => {
  return useContext(Web3EnvContext)
}

export { Web3EnvProvider, useWeb3EnvContext }
