import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { supportWallets, Wallet } from '@/web3/connectors'

const useConnectingWallet = (): Wallet | undefined => {
  const { connector } = useWeb3React()

  return useMemo(() => {
    return supportWallets.find(o => o.connector === connector)
  }, [connector])
}

export default useConnectingWallet
