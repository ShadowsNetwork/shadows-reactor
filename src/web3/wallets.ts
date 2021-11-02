import MetamaskIcon from '@/img/wallet/metamask.svg'
import BSCIcon from '@/img/wallet/bsc.png'
import WalletConnectIcon from '@/img/wallet/walletconnect.svg'
import { setAccount, setSelectedWallet } from '@/store/wallet'
import { providers } from 'ethers'
import { Dispatch } from 'redux'
import { MetamaskWeb3Provider } from './providers/Metamask'
import { WalletConnectWeb3Provider } from './providers/WalletConnect'
import WalletConnectProvider from '@walletconnect/ethereum-provider'
import { BscWeb3Provider } from '@/web3/providers/BSC'

export type WalletNames = 'Metamask' | 'BSC' | 'WalletConnect'

export interface Wallet {
  name: string
  icon: string,
  handleConnect: (_dispatch: Dispatch<any>, _chainId: number, _RPCUrl?: string) => void
}

export async function getWeb3ProviderByWallet(
  { chainId, RPCUrl }, walletName: WalletNames
): Promise<providers.Web3Provider> {
  return await (new Map<WalletNames, any>([
    ['Metamask', MetamaskWeb3Provider],
    ['BSC', BscWeb3Provider],
    ['WalletConnect', WalletConnectWeb3Provider]
  ]).get(walletName))({
    chainId, RPCUrl
  })
}

const connectToMetamask = async (dispatch: Dispatch<any>, chainId: number, RPCUrl?: string): Promise<void> => {
  const web3Provider = await getWeb3ProviderByWallet({
    chainId, RPCUrl
  }, 'Metamask') as providers.Web3Provider

  await web3Provider.provider.request?.({ method: 'eth_requestAccounts' })
  dispatch(setSelectedWallet('Metamask'))
}

const connectToBSC = async (dispatch: Dispatch<any>, chainId: number, RPCUrl?: string): Promise<void> => {
  const web3Provider = await getWeb3ProviderByWallet({
    chainId, RPCUrl
  }, 'BSC') as providers.Web3Provider

  await web3Provider.provider.request?.({ method: 'eth_requestAccounts' })
  dispatch(setSelectedWallet('BSC'))
}

const connectToWalletConnect = async (dispatch: Dispatch<any>, chainId: number, RPCUrl?: string): Promise<void> => {
  const web3Provider = await getWeb3ProviderByWallet({ chainId, RPCUrl }, 'WalletConnect')

  const walletConnectProvider = web3Provider.provider as WalletConnectProvider

  console.log(walletConnectProvider)
  walletConnectProvider.enable()
    .then(accounts => {
      const [account] = accounts
      dispatch(setAccount(account))
      dispatch(setSelectedWallet('WalletConnect'))
    })
  // console.log(`wc connected: ${walletConnectProvider.wc.connected}`)
  // if (!walletConnectProvider.wc.connected) {
  //   walletConnectProvider.wc.connect({ chainId })
  //     .then(r => {
  //       console.log(r)
  //       const [account] = r.accounts
  //       dispatch(setAccount(account))
  //       dispatch(setSelectedWallet('WalletConnect'))
  //       const connectedChainId = r.chainId
  //       if (connectedChainId !== chainId) {
  //         message.warn('Not in correct network!')
  //       }
  //     })
  // }

  // walletConnectProvider.enable()
  //   .then(accounts => {
  //     const [account] = accounts
  //     dispatch(setAccount(account))
  //     dispatch(setSelectedWallet('WalletConnect'))
  //   })
  //   .catch(error => {
  //     console.log(error)
  //   })
}

export const SUPPORT_WALLETS: Wallet[] = [
  {
    name: 'Metamask',
    icon: MetamaskIcon,
    handleConnect: connectToMetamask
  },
  {
    name: 'Wallet Connect',
    icon: WalletConnectIcon,
    handleConnect: connectToWalletConnect
  },
  {
    name: 'Binance Chain Wallet',
    icon: BSCIcon,
    handleConnect: connectToBSC
  }
]
