import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import {
  getSelectedWallet, getTransactionHistoryList, setAccount, setSelectedWallet,
  updateTransactionHistoryStatus
} from '@/store/wallet'
import routers from '@/router'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'

import { providers } from 'ethers'
import { getWeb3ProviderByWallet, WalletNames } from '@/web3/wallets'
import ContractSettings from '@/ShadowsJs/ContractSettings'
import WalletConnectProvider from '@walletconnect/web3-provider'
import {
  EthereumChainParams, setupBinanceWalletNetwork, setupMetamaskNetwork, setupWalletConnectNetwork
} from '@/ShadowsJs/networkHelper'
import { Web3Provider } from '@ethersproject/providers'
import {
  BridgeDows, TransactionHistoryImplementationClassType, TransactionStatus
} from '@/types/TransactionHistory'
import axios from 'axios'
import { PolyTransactionStatus } from '@/types/PolyTransactionStatus'

export function useLocation(): Location {
  const [location, setLocation] = useState(window.location)

  const listenToPopstate = () => {
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

        await walletConnectProvider.enable()

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
        provider.provider.request({ method: 'eth_requestAccounts' })
          .then(accounts => {
            const [account] = accounts
            dispatch(setAccount(account))
          })

        // @ts-ignore
        provider.provider.on('accountsChanged', async (newAccount, _) => {
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
        setReady(await setupBinanceWalletNetwork(params))
      }
    })
      .catch(async () => {
        if (selectedWallet === 'Metamask') {
          setReady(await setupMetamaskNetwork(params))
        } else if (selectedWallet === 'BSC') {
          setReady(await setupBinanceWalletNetwork(params))
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

export function useListenBridgeTransactionStatus() {
  const dispatch = useDispatch()
  const transactionList = useSelector(getTransactionHistoryList)

  const task = bridgeTransactions => {
    bridgeTransactions.forEach(async (t: BridgeDows) => {
      const { hash } = t

      await axios.post('https://bridge.poly.network/testnet/v1/transactionofhash', {
        hash: hash.substring(2)
      })
        .then(r => {
          const state = r.data.State
          const transactionsWithHash = r.data.TransactionState.filter(s => s.Hash)
          const lastTransaction = transactionsWithHash[transactionsWithHash.length - 1]

          if (t.state !== state) {
            t.state = state
            t.lastTransactionHash = lastTransaction.Hash
            t.lastTransactionPolyChainId = lastTransaction.ChainId

            if (state === PolyTransactionStatus.FINISHED) {
              t.complete()
              dispatch(updateTransactionHistoryStatus(t))
            }
            dispatch(updateTransactionHistoryStatus(t))
          }
        })
        .catch(async _ => {
          const receipt = await dowsJSConnector.provider!.waitForTransaction(hash, 0)
          if (!receipt.status) {
            t.fail()
            dispatch(updateTransactionHistoryStatus(t))
          }
        })
    })
  }

  useEffect(() => {
    const bridgeTransactions: BridgeDows[] = transactionList.filter(t =>
      t.TYPE === TransactionHistoryImplementationClassType.Bridge
      && t.status !== TransactionStatus.Completed
      && t.status !== TransactionStatus.Failed
    ) as BridgeDows[]

    if (bridgeTransactions.length === 0) {
      return

    }
    const intervalId = setInterval(() => task(bridgeTransactions), 5000)

    return () => clearInterval(intervalId)
  }, [transactionList])
}

