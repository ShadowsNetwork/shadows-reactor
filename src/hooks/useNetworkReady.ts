import { useEffect, useMemo, useState } from 'react'
import { providers } from 'ethers'
import { getWeb3ProviderByWallet, WalletNames } from '@/web3/wallets'
import { useSelector } from 'react-redux'
import { getSelectedWallet } from '@/store/wallet'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import ContractSettings from '@/ShadowsJs/ContractSettings'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import useRequiredChain from '@/hooks/useRequiredChain'

export function useNetworkReady(): boolean | undefined {
  const requiredChain = useRequiredChain()

  const [currentNetwork, setCurrentNetwork] = useState<providers.Network>()
  const [provider, setProvider] = useState<providers.Web3Provider>()

  const { slowRefreshFlag } = useRefreshController()

  const selectedWallet = useSelector(getSelectedWallet) as WalletNames

  useEffect(() => {
    if (!requiredChain || !selectedWallet) {
      return
    }

    const { chainId, rpcUrls } = requiredChain
    const [RPCUrl] = rpcUrls

    getWeb3ProviderByWallet({ chainId, RPCUrl }, selectedWallet)
      .then(provider => {
        setProvider(provider)

        return provider.ready
      })
      ?.then(async network => {
        setCurrentNetwork(network)
      })
  }, [requiredChain, selectedWallet, slowRefreshFlag])

  const ready = useMemo(
    () => {
      if (!currentNetwork || !requiredChain) {
        return undefined
      }

      return currentNetwork.chainId === parseInt(requiredChain.chainId, 16)
    },
    [currentNetwork, requiredChain]
  )

  if (ready && provider && requiredChain) {
    dowsJSConnector.setContractSettings(new ContractSettings(
      provider,
      !selectedWallet ? provider : (provider.getSigner ? provider.getSigner() : null),
      requiredChain.chainId
    ))
  }

  return ready
}
