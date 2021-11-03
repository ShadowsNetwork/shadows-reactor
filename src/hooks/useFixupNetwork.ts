import useRequiredChain from '@/hooks/useRequiredChain'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useConnectingWallet from '@/hooks/useConnectingWallet'

const useFixupNetwork = (networkReady?: boolean) => {
  const location = useLocation()

  const requiredChain = useRequiredChain()!

  const connectingWallet = useConnectingWallet()

  useEffect(() => {
    if (!requiredChain || networkReady || networkReady === undefined) {
      return
    }

    // if (connectingWallet === 'Metamask') {
    //   setupMetamaskNetwork(requiredChain)
    // } else if (selectedWallet === 'BSC') {
    //   setupBinanceWalletNetwork(requiredChain)
    // }

  }, [requiredChain, networkReady, location])
}

export default useFixupNetwork
