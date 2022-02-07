import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'

export function useErrorMessage(): any {
  const { connector } = useWeb3React()

  return useCallback((e: any) => {
    if (!connector) {
      return 'Please connect to a wallet first'
    }

    if (connector instanceof InjectedConnector) {
      const detailMessage = e.data ? ` (${e.data.message})` : ''
      return `${e.message}${detailMessage}`
    }

    if (connector instanceof WalletConnectConnector) {
      return e.toString()
    }

    if (connector instanceof BscConnector) {
      return e.error
    }

    return 'Unknown selected wallet'
  }, [connector])
}
