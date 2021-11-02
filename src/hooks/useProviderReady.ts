import { useDispatch, useSelector } from 'react-redux'
import { getAccount, getSelectedWallet, setAccount, setSelectedWallet } from '@/store/wallet'
import { getWeb3ProviderByWallet, WalletNames } from '@/web3/wallets'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import { useCallback, useEffect, useState } from 'react'
import { providers } from 'ethers'
import web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useNetworkReady } from '@/hooks/useNetworkReady'
import useRequiredChain from '@/hooks/useRequiredChain'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import ContractSettings from '@/ShadowsJs/ContractSettings'

const DEFAULT_PROVIDER = new providers.Web3Provider(new web3.providers.HttpProvider(process.env.RPC_URL as string) as any)

export function useProviderReady(): boolean {
  const dispatch = useDispatch()

  const requiredChain = useRequiredChain()

  const selectedWallet = useSelector(getSelectedWallet) as WalletNames | undefined
  const account = useSelector(getAccount)

  const { forceRefresh } = useRefreshController()

  const [networkReady] = useNetworkReady()

  const [ready, setReady] = useState(false)

  const [provider, setProvider] = useState<providers.Web3Provider>(DEFAULT_PROVIDER)

  useEffect(() => {
    if (selectedWallet && requiredChain) {
      const { chainId, rpcUrls } = requiredChain
      const [RPCUrl] = rpcUrls

      getWeb3ProviderByWallet({ chainId, RPCUrl }, selectedWallet)
        .then(provider => {
          setProvider(provider)
        })
    }
  }, [selectedWallet, requiredChain])

  useEffect(() => {
    if (provider?.provider !== undefined) {
      if (selectedWallet === 'WalletConnect') {
        const handleDisconnect = () => {
          dispatch(setAccount(null))
          dispatch(setSelectedWallet(null))
        }

        const wcProvider: WalletConnectProvider = provider.provider as WalletConnectProvider

        if (wcProvider.connector) {
          const { connector } = wcProvider
          connector.on('disconnect', handleDisconnect)
        }
      }

      // @ts-ignore
      if ((selectedWallet === 'Metamask' || selectedWallet === 'BSC') && provider!.provider.on) {

        provider.provider.request?.({ method: 'eth_requestAccounts' })
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
            setReady(false)
          } else {
            dispatch(setAccount(newAccount[0]))
          }
          forceRefresh()
        })

        // @ts-ignore
        provider.provider.on('chainChanged', async (newChain, oldChain) => {
          console.log(newChain, oldChain)
          forceRefresh()
        })
      }
    }
  }, [provider, provider?.provider])

  const initialize = useCallback(async () => {
    setReady(false)

    if (!requiredChain) {
      return
    }

    if (networkReady) {
      dowsJSConnector.setContractSettings(new ContractSettings(
        provider,
        selectedWallet ? (provider.getSigner ? provider.getSigner() : null) : provider,
        requiredChain.chainId
      ))
    } else {
      dowsJSConnector.setContractSettings(new ContractSettings(
        provider,
        undefined,
        parseInt(process.env.CHAIN_ID as string, 16)
      ))
    }

    setReady(true)
  }, [selectedWallet, requiredChain, networkReady, account, provider])

  useEffect(() => {
    initialize()
  }, [initialize])

  return ready
}
