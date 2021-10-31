import { useDispatch, useSelector } from 'react-redux'
import { getAccount, getSelectedWallet, setAccount, setSelectedWallet } from '@/store/wallet'
import { getWeb3ProviderByWallet, WalletNames } from '@/web3/wallets'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import { useCallback, useEffect, useState } from 'react'
import { providers } from 'ethers'
import web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { EthereumChain } from '@/ShadowsJs/networkHelper'
import { useNetworkReady } from '@/hooks/useNetworkReady'

export function useInitializeProvider(requiredChain?: EthereumChain): boolean {
  const dispatch = useDispatch()

  const selectedWallet = useSelector(getSelectedWallet) as WalletNames
  const account = useSelector(getAccount)

  const { forceRefresh } = useRefreshController()

  const networkReady = useNetworkReady(requiredChain)

  const [initialized, setInitialized] = useState(false)
  let provider: providers.Web3Provider

  const currentProvider: any = new web3.providers.HttpProvider(process.env.RPC_URL as string)
  provider = new providers.Web3Provider(currentProvider)

  const initialize = useCallback(async () => {
    if (!requiredChain || !selectedWallet) {
      setInitialized(false)
      return
    }

    const { chainId, rpcUrls } = requiredChain
    const [RPCUrl] = rpcUrls

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
    }

    if (selectedWallet === 'Metamask' || selectedWallet === 'BSC') {
      // @ts-ignore
      provider.provider.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          const [account] = accounts
          dispatch(setAccount(account))
        })

      // @ts-ignore
      provider.provider.on('accountsChanged', async (newAccount, _) => {
        console.log(newAccount)
        if (!newAccount.length) {
          dispatch(setAccount(null))
          dispatch(setSelectedWallet(null))
          setInitialized(false)
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

    // dowsJSConnector.setContractSettings(new ContractSettings(
    //   provider,
    //   !selectedWallet ? provider : (provider.getSigner ? provider.getSigner() : null),
    //   chainId
    // ))

    setInitialized(true)
  }, [selectedWallet, requiredChain, networkReady, account])

  useEffect(() => {
    initialize()
  }, [initialize])

  return initialized
}
