import { EthereumChain } from '@/ShadowsJs/networkHelper'
import { useEffect, useState } from 'react'
import { providers } from 'ethers'
import { getWeb3ProviderByWallet, WalletNames } from '@/web3/wallets'
import { useSelector } from 'react-redux'
import { getSelectedWallet } from '@/store/wallet'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import ContractSettings from '@/ShadowsJs/ContractSettings'

export function useNetworkReady(requiredChain?: EthereumChain): boolean {
  const [currentNetwork, setCurrentNetwork] = useState<providers.Network>()
  const [provider, setProvider] = useState<providers.Web3Provider>()

  const selectedWallet = useSelector(getSelectedWallet) as WalletNames

  useEffect(() => {
    if (!requiredChain || !selectedWallet) {
      return
    }

    const { chainId, rpcUrls } = requiredChain
    const [RPCUrl] = rpcUrls

    getWeb3ProviderByWallet({ chainId , RPCUrl }, selectedWallet)
      .then(provider => {
        setProvider(provider)

        return provider.ready
      })
      ?.then(async network => {
        setCurrentNetwork(network)
      })
  }, [requiredChain, selectedWallet])

  const ready = currentNetwork?.chainId === parseInt(requiredChain?.chainId ?? '-1', 16)

  // if (!ready && requiredChain) {
  //   if (selectedWallet === 'Metamask') {
  //     setupMetamaskNetwork(requiredChain)
  //   } else if (selectedWallet === 'BSC') {
  //     setupBinanceWalletNetwork(requiredChain)
  //   }
  // }

  if (ready && provider && requiredChain) {
    dowsJSConnector.setContractSettings(new ContractSettings(
      provider,
      !selectedWallet ? provider : (provider.getSigner ? provider.getSigner() : null),
      requiredChain.chainId
    ))
  }

  return ready
}
