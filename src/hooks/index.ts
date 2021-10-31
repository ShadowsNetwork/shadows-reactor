import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import {
  getSelectedWallet, getTransactionHistoryList, setAccount, setSelectedWallet,
  updateTransactionHistoryStatus
} from '@/store/wallet'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import web3 from 'web3'
import { providers } from 'ethers'
import { getWeb3ProviderByWallet, WalletNames } from '@/web3/wallets'
import ContractSettings from '@/ShadowsJs/ContractSettings'
import WalletConnectProvider from '@walletconnect/web3-provider'
import {
  EthereumChain, setupBinanceWalletNetwork, setupMetamaskNetwork, setupWalletConnectNetwork
} from '@/ShadowsJs/networkHelper'
import { Web3Provider } from '@ethersproject/providers'
import {
  BridgeDows, TransactionHistory, TransactionHistoryImplementationClassType, TransactionStatus
} from '@/types/TransactionHistory'
import axios from 'axios'
import { PolyTransactionStatus } from '@/types/PolyTransactionStatus'
import { useRefreshController } from '@/contexts/RefreshControllerContext'

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

export function useInitializeProvider(chainIdHexString?: string, RPCUrl?: string): boolean {
  const dispatch = useDispatch()

  const selectedWallet = useSelector(getSelectedWallet) as WalletNames

  const { forceRefresh } = useRefreshController()

  const [initialized, setInitialized] = useState(false)
  let provider: providers.Web3Provider

  const currentProvider: any = new web3.providers.HttpProvider(process.env.RPC_URL as string)
  provider = new providers.Web3Provider(currentProvider)

  const initialize = useCallback(async () => {
    if (!chainIdHexString || !RPCUrl) {
      return
    }

    const chainId = parseInt(chainIdHexString, 16)

    if (selectedWallet) {
      provider = await getWeb3ProviderByWallet({ chainId , RPCUrl }, selectedWallet)
    }

    if (selectedWallet === 'WalletConnect') {
      const walletConnectProvider = provider.provider as WalletConnectProvider

      await walletConnectProvider.enable()

      const handleAccountChange = (accounts: string[]) => {
        const [account] = accounts
        dispatch(setAccount(account))
        dispatch(setSelectedWallet('WalletConnect'))
        forceRefresh()
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
        forceRefresh()
      })

      // @ts-ignore
      provider.provider.on('chainChanged', async (newChain, oldChain) => {
        console.log(newChain, oldChain)
        window.location.reload()
      })
    }

    dowsJSConnector.setContractSettings(new ContractSettings(
      provider,
      !selectedWallet ? provider : (provider.getSigner ? provider.getSigner() : null),
      chainId
    ))

    setInitialized(true)
  }, [selectedWallet, chainIdHexString, RPCUrl])

  useEffect(() => {
    initialize()
  }, [initialize])

  return initialized
}

export function useSetupNetwork(providerInitialized: boolean, chain?: EthereumChain): boolean {
  const dispatch = useDispatch()
  const selectedWallet = useSelector(getSelectedWallet) as WalletNames
  const [ready, setReady] = useState(false)

  const setup = useCallback(async () => {
    if (!chain) {
      return
    }

    const chainId = parseInt(chain.chainId, 16)
    const [RPCUrl] = chain.rpcUrls

    let provider: providers.Web3Provider
    const currentProvider: any = new web3.providers.HttpProvider(process.env.RPC_URL as string)
    provider = new providers.Web3Provider(currentProvider)

    if (selectedWallet) {
      provider = await getWeb3ProviderByWallet({
        chainId, RPCUrl
      }, selectedWallet) as Web3Provider
    }

    if (selectedWallet === 'WalletConnect') {
      if (await setupWalletConnectNetwork(chain, provider)) {
        setReady(true)
      } else {
        setReady(false)
        dispatch(setAccount(null))
        dispatch(setSelectedWallet(null))
      }
      return
    }

    // WalletConnect couldn't use this method because not enable() before
    provider?.ready?.then(async network => {
      if (network.chainId === parseInt(chain.chainId, 16)) {
        setReady(true)
        return
      }

      if (selectedWallet === 'Metamask') {
        setReady(await setupMetamaskNetwork(chain))
      } else if (selectedWallet === 'BSC') {
        setReady(await setupBinanceWalletNetwork(chain))
      }
    })
      .catch(async () => {
        if (selectedWallet === 'Metamask') {
          setReady(await setupMetamaskNetwork(chain))
        } else if (selectedWallet === 'BSC') {
          setReady(await setupBinanceWalletNetwork(chain))
        }
      })

  }, [selectedWallet, providerInitialized, chain])

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

      await axios.post('https://bridge.poly.network/v1/transactionofhash', {
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

export function useListenBscTransaction() {
  const { forceRefresh } = useRefreshController()

  const dispatch = useDispatch()
  const transactionList = useSelector(getTransactionHistoryList)

  useEffect(() => {
    const transactionHistories: TransactionHistory[] = transactionList.filter(t =>
      t.TYPE !== TransactionHistoryImplementationClassType.Bridge
      && t.status !== TransactionStatus.Completed && t.status !== TransactionStatus.Failed
    )

    if (transactionHistories.length === 0) {
      return
    }

    transactionHistories.forEach(th => {
      dowsJSConnector.provider?.getTransaction(th.hash)
        .then(transaction => {
          transaction.wait().then(() => {
            th.complete()
            dispatch(updateTransactionHistoryStatus(th))
            forceRefresh()
          }).catch(() => {
            th.fail()
            dispatch(updateTransactionHistoryStatus(th))
          })
        })
    })
  }, [transactionList])
}

