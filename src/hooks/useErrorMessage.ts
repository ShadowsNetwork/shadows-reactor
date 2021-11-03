import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export function useErrorMessage(): any {
  const { connector } = useWeb3React()

  return useCallback((e: any) => {
    if (!connector) {
      return 'No Wallet Connected'
    } else if (connector instanceof InjectedConnector) {
      const detailMessage = e.data ? ` (${e.data.message})` : ''
      return `${e.message}${detailMessage}`
    } else if (connector instanceof WalletConnectConnector) {
      return e.toString()
    } else {
      throw new Error('Unknown selected wallet')
    }
  }, [connector])
}
