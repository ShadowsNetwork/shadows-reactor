import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import { getSelectedWallet, setAccount, setSelectedWallet } from '@/store/wallet'
import routers from '@/router'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'

import { providers } from 'ethers'
import { getWeb3ProviderByWallet, WalletNames } from '@/web3/wallets'
import ContractSettings from '@/ShadowsJs/ContractSettings'
import WalletConnectProvider from '@walletconnect/web3-provider'
import {
  EthereumChainParams, setupBSCNetwork, setupMetamaskNetwork, setupWalletConnectNetwork
} from '@/ShadowsJs/networkHelper'
import { Web3Provider } from '@ethersproject/providers'

export function useLocation(): Location {
  const [location, setLocation] = useState(window.location)

  const listenToPopstate = () => {
    const { hash } = window.location
    console.log(hash)
    if (hash === '#/') {
      window.location.hash = '#/liquidity'
    }
    setLocation(window.location)
  }

  useEffect(() => {
    window.addEventListener('popstate', listenToPopstate)

    return () => {
      window.removeEventListener('popstate', listenToPopstate)
    }
  }, [])

  return location
}

export function useSetupProvider(): void {
  const dispatch = useDispatch()

  useEffect(() => {
    const ethereum = (window as WindowChain).ethereum
    if (ethereum) {
      const { selectedAddress } = ethereum
      dispatch(setAccount(selectedAddress))

      ethereum.on('accountsChanged', async (newAccount, oldAccount) => {
        console.log('on accounts changed: ', newAccount, oldAccount)
        if (!newAccount.length) {
          dispatch(setAccount(null))
          dispatch(setSelectedWallet(null))
        } else {
          dispatch(setAccount(newAccount[0]))
        }
      })
    }

    return () => {
      const ethereum = (window as WindowChain).ethereum
      if (ethereum) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        ethereum.removeListener('accountsChanged', () => {
        })
      }
    }
  }, [dispatch])
}

export function useDynamicBackgroundImage(): string {
  const [background, setBackground] = useState('')

  const { hash } = useLocation()
  const path = hash.replace(new RegExp('(#/)?'), '/')

  useEffect(() => {
    const currentRouter = routers.filter(router => router.path === path)[0]
    setBackground(currentRouter?.backgroundImage)
  }, [hash])

  return background
}

export function useInitializeProvider(chainId: number, RPCUrl?: string): boolean {
  const dispatch = useDispatch()
  const [initialized, setInitialized] = useState(false)
  const selectedWallet = useSelector(getSelectedWallet) as WalletNames

  const initialize = useCallback(async () => {
    let provider: providers.Web3Provider | undefined
    try {
      provider = await getWeb3ProviderByWallet({ chainId, RPCUrl }, selectedWallet)

      if (!selectedWallet || !provider) {
        setInitialized(false)
        return
      }

      if (selectedWallet === 'WalletConnect') {
        const walletConnectProvider = provider.provider as WalletConnectProvider

        const handleAccountChange = (accounts: string[]) => {
          const [account] = accounts
          dispatch(setAccount(account))
          dispatch(setSelectedWallet('WalletConnect'))
        }

        const handleDisconnect = (code: number, reason: string) => {
          console.log(code, reason)
          dispatch(setAccount(null))
          dispatch(setSelectedWallet(null))

          walletConnectProvider.stop()
          walletConnectProvider.removeListener('accountsChanged', handleAccountChange)
        }

        const handleChainChanged = (_, __) => {
          console.log(_, __)
        }

        walletConnectProvider.removeListener('disconnect', handleDisconnect)
        walletConnectProvider.removeListener('accountsChanged', handleAccountChange)
        walletConnectProvider.removeListener('chainChanged', handleChainChanged)

        walletConnectProvider.on('disconnect', handleDisconnect)
        walletConnectProvider.on('accountsChanged', handleAccountChange)
        walletConnectProvider.on('chainChanged', handleChainChanged)
      } else if (selectedWallet === 'Metamask' || selectedWallet === 'BSC') {
        // @ts-ignore
        await provider.provider.enable()

        // @ts-ignore
        provider.provider.on('accountsChanged', async (newAccount, oldAccount) => {
          console.log('on accounts changed: ', newAccount, oldAccount)
          if (!newAccount.length) {
            dispatch(setAccount(null))
            dispatch(setSelectedWallet(null))
          } else {
            dispatch(setAccount(newAccount[0]))
          }
        })

        // @ts-ignore
        provider.provider.on('chainChanged', async (newChain, oldChain) => {
          console.log(newChain, oldChain)
          window.location.reload()
        })
      }
    } catch (e) {
      dispatch(setAccount(null))
      dispatch(setSelectedWallet(null))
      return
    }

    dowsJSConnector.setContractSettings(new ContractSettings(
      provider,
      provider.getSigner ? provider.getSigner() : null,
      chainId
    ))
    setInitialized(true)
  }, [selectedWallet, chainId, RPCUrl])

  useEffect(() => {
    initialize()
  }, [initialize])

  return initialized
}

export function useSetupNetwork(providerInitialized: boolean, params: EthereumChainParams): boolean {
  const chainId = parseInt(params.chainId, 16)
  const [RPCUrl] = params.rpcUrls

  const dispatch = useDispatch()
  const selectedWallet = useSelector(getSelectedWallet) as WalletNames
  const [ready, setReady] = useState(false)

  const setup = useCallback(async () => {
    if (!selectedWallet || !providerInitialized) {
      setReady(false)
      return
    }

    const web3Provider = await getWeb3ProviderByWallet({
      chainId, RPCUrl
    }, selectedWallet) as unknown as Web3Provider

    if (selectedWallet === 'WalletConnect') {
      if (await setupWalletConnectNetwork(params, web3Provider)) {
        setReady(true)
      } else {
        setReady(false)
        dispatch(setAccount(''))
        dispatch(setSelectedWallet(''))
      }
      return
    }

    // WalletConnect couldn't use this method because not enable() before
    web3Provider?.ready?.then(async network => {
      if (network.chainId === parseInt(params.chainId, 16)) {
        setReady(true)
        return
      }

      if (selectedWallet === 'Metamask') {
        setReady(await setupMetamaskNetwork(params))
      } else if (selectedWallet === 'BSC') {
        setReady(await setupBSCNetwork(params))
      }
    }).catch(async () => {
      if (selectedWallet === 'Metamask') {
        setReady(await setupMetamaskNetwork(params))
      } else if (selectedWallet === 'BSC') {
        setReady(await setupBSCNetwork(params))
      }
    })
  }, [selectedWallet, providerInitialized, params])

  useEffect(() => {
    setup()
  }, [setup])

  return ready
}

export function useErrorMessage(): any {
  const selectedWallet = useSelector(getSelectedWallet) as WalletNames | undefined

  return useCallback((e: any) => {
    if (!selectedWallet) {
      return 'No Wallet Connected'
    } else if (selectedWallet === 'Metamask') {
      const detailMessage = e.data ? ` (${e.data.message})` : ''
      return `${e.message}${detailMessage}`
    } else if (selectedWallet === 'BSC') {
      return e.error
    } else if (selectedWallet === 'WalletConnect') {
      return e.toString()
    } else {
      throw new Error('Unknown selected wallet')
    }
  }, [selectedWallet])
}
