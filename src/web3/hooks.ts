/*
import { useCallback, useEffect, useState } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'

import {
  NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'

import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect, WalletConnectConnector
} from '@web3-react/walletconnect-connector'

import { setupNetwork } from '@/ShadowsJs/networkHelper'
import { NoBscProviderError } from '@binance-chain/bsc-connector'

/!*export function useEagerConnect(): boolean {
  const {
    activate,
    active
  } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injectedConnector.isAuthorized()
      .then((isAuthorized: boolean) => {
        if (isAuthorized) {
          activate(injectedConnector, undefined, true)
            .catch(() => {
              setTried(true)
            })
        } else {
          setTried(true)
        }
      })
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}*!/

/!*export function useInactiveListener(suppress = false): void {
  const {
    active,
    error,
    activate
  } = useWeb3React()

  useEffect((): any => {
    const { ethereum } = window as any
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log('Handling \'connect\' event')
        activate(injectedConnector)
      }
      const handleChainChanged = (chainId: string | number) => {
        console.log('Handling \'chainChanged\' event with payload', chainId)
        activate(injectedConnector)
      }
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('Handling \'accountsChanged\' event with payload', accounts)
        if (accounts.length > 0) {
          activate(injectedConnector)
        }
      }
      const handleNetworkChanged = (networkId: string | number) => {
        console.log('Handling \'networkChanged\' event with payload', networkId)
        activate(injectedConnector)
      }

      ethereum.on('connect', handleConnect)
      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('networkChanged', handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect)
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          ethereum.removeListener('networkChanged', handleNetworkChanged)
        }
      }
    }
  }, [active, error, suppress, activate])
}*!/

interface UseConnectType {
  login,
  logout
}

/!*export function useConnect(): UseConnectType {
  const { activate, deactivate } = useWeb3React()

  const login = useCallback((connector: Connector) => {
    activate(connector, async (error: Error) => {
      if (error instanceof UnsupportedChainIdError) {
        const hasSetup = await setupNetwork()
        if (hasSetup) {
          login(connector)
        }
      } else {
        if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
          console.log('Provider Error', 'No provider was found')
        } else if (
          error instanceof UserRejectedRequestErrorInjected ||
          error instanceof UserRejectedRequestErrorWalletConnect
        ) {
          if (connector instanceof WalletConnectConnector) {
            const walletConnector = connector as WalletConnectConnector
            walletConnector.walletConnectProvider = null
          }
          console.log('Authorization Error', 'Please authorize to access your account')
        } else {
          console.log(error.name, error.message)
        }
      }
    })
  }, [])

  return { login, logout: deactivate }
}*!/
*/
