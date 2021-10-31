import { setupBinanceWalletNetwork, setupMetamaskNetwork } from '@/ShadowsJs/networkHelper'
import { useSelector } from 'react-redux'
import { getSelectedWallet } from '@/store/wallet'
import { WalletNames } from '@/web3/wallets'
import useRequiredChain from '@/hooks/useRequiredChain'
import { useEffect } from 'react'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'
import { useLocation } from 'react-router-dom'

const useFixupNetwork = () => {
  const location = useLocation()
  const { networkReady } = useWeb3EnvContext()

  const selectedWallet = useSelector(getSelectedWallet) as WalletNames
  const requiredChain = useRequiredChain()!

  useEffect(() => {
    if (!requiredChain || networkReady) {
      return
    }

    if (selectedWallet === 'Metamask') {
      setupMetamaskNetwork(requiredChain)
    } else if (selectedWallet === 'BSC') {
      setupBinanceWalletNetwork(requiredChain)
    }

  }, [requiredChain, networkReady, selectedWallet, location])
}

export default useFixupNetwork
