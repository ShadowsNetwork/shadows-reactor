import { setupBinanceWalletNetwork, setupMetamaskNetwork } from '@/ShadowsJs/networkHelper'
import { useSelector } from 'react-redux'
import { getSelectedWallet } from '@/store/wallet'
import { WalletNames } from '@/web3/wallets'
import useRequiredChain from '@/hooks/useRequiredChain'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const useFixupNetwork = (networkReady?: boolean) => {
  const location = useLocation()

  const selectedWallet = useSelector(getSelectedWallet) as WalletNames
  const requiredChain = useRequiredChain()!

  useEffect(() => {
    if (!requiredChain || networkReady || networkReady === undefined) {
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
