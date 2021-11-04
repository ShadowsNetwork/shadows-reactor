import useRequiredChain from '@/hooks/useRequiredChain'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useConnectingWallet from '@/hooks/useConnectingWallet'
import {
  setupBSCWalletNetwork, setupMetamaskNetwork, setupWalletConnectNetwork
} from '@/web3/network'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const useFixupNetwork = () => {
  const { providerReady, networkReady } = useWeb3EnvContext()
  const location = useLocation()
  const requiredChain = useRequiredChain()!

  const { connector } = useWeb3React()
  const connectingWallet = useConnectingWallet()

  useEffect(() => {
    if (!requiredChain || networkReady || !providerReady) {
      return
    }

    const setupArgs = { chain: requiredChain }

    if (connector instanceof InjectedConnector) {
      setupMetamaskNetwork(setupArgs)
    }

    if (connector instanceof BscConnector) {
      setupBSCWalletNetwork(setupArgs)
    }

    if (connector instanceof WalletConnectConnector) {
      setupWalletConnectNetwork(setupArgs)
    }
  }, [networkReady, providerReady, requiredChain, location, connectingWallet])
}

export default useFixupNetwork
