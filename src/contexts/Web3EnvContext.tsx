import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { setChainId, setRpcUrl } from '../store/wallet'
import { useInitializeProvider, useSetupNetwork } from '../hooks'

const Web3EnvContext = React.createContext({ providerInitialized: false, networkReady: false })

const Web3EnvProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch()

  const hexChainId = process.env.CHAIN_ID!
  const decChainId = parseInt(hexChainId, 16)
  const RPCUrl = process.env.RPC_URL!
  const blockExplorerUrl = process.env.BLOCK_EXPLORER_URL!
  const chainName = process.env.NETWORK_NAME!

  dispatch(setChainId(decChainId))
  dispatch(setRpcUrl(RPCUrl))

  const providerInitialized = useInitializeProvider(decChainId, RPCUrl)
  const networkReady = useSetupNetwork(providerInitialized, {
    blockExplorerUrls: [blockExplorerUrl],
    chainName,
    chainId: hexChainId,
    rpcUrls: [RPCUrl]
  })

  return <Web3EnvContext.Provider value={{ providerInitialized, networkReady }}>{children}</Web3EnvContext.Provider>
}

const useWeb3EnvContext = () => {
  return useContext(Web3EnvContext)
}

export { Web3EnvProvider, useWeb3EnvContext }
