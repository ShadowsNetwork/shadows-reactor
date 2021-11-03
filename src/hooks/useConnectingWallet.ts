import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { supportWallets } from '@/web3/connectors'

const useConnectingWallet = () => {
  const { connector } = useWeb3React()

  return useMemo(() => {
    return supportWallets.find(o => typeof o.connector === typeof o.connector)
  }, [connector])
}

export default useConnectingWallet
