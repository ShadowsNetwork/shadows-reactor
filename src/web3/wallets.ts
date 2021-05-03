import MetamaskIcon from '@/img/wallet/metamask.svg'
import BSCIcon from '@/img/wallet/bsc.png'
import WalletConnectIcon from '@/img/wallet/walletconnect.svg'
import { setAccount, setSelectedWallet } from '@/store/wallet'
import { providers } from 'ethers'
import { Dispatch } from 'redux'
import { MetamaskWeb3Provider } from './providers/Metamask'
import { WalletConnectWeb3Provider } from './providers/WalletConnect'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { BscWeb3Provider } from '@/web3/providers/BSC'

export type WalletNames = 'Metamask' | 'BSC' | 'WalletConnect'

export interface Wallet {
  name: string
  icon: string,
  handleConnect: (_dispatch: Dispatch<any>, _chainId: number, _RPCUrl?: string) => void
}

export async function getWeb3ProviderByWallet(
  { chainId, RPCUrl }, walletName?: WalletNames
): Promise<providers.Web3Provider | undefined> {
  if (!walletName) {
    return undefined
  }

  return await (new Map<WalletNames, any>([
    ['Metamask', MetamaskWeb3Provider],
    ['BSC', BscWeb3Provider],
    ['WalletConnect', WalletConnectWeb3Provider]
  ]).get(walletName))({
    chainId, RPCUrl
  })
}

const connectToMetamask = async (dispatch: Dispatch<any>, chainId: number, RPCUrl?: string): Promise<void> => {
  const provider = await getWeb3ProviderByWallet({
    chainId, RPCUrl
  }, 'Metamask') as providers.Web3Provider

  provider.provider.request?.({ method: 'eth_requestAccounts' })
    .then(accounts => {
      const [account] = accounts
      dispatch(setAccount(account))
      dispatch(setSelectedWallet('Metamask'))
    })
}

const connectToBSC = async (dispatch: Dispatch<any>, chainId: number, RPCUrl?: string): Promise<void> => {
  const web3Provider = await getWeb3ProviderByWallet({
    chainId, RPCUrl
  }, 'BSC') as providers.Web3Provider

  const bscProvider = web3Provider.provider
  // @ts-ignore
  const accounts = await bscProvider.enable()
  const [account] = accounts
  dispatch(setAccount(account))
  dispatch(setSelectedWallet('BSC'))
}

const connectToWalletConnect = async (dispatch: Dispatch<any>, chainId: number, RPCUrl?: string): Promise<void> => {
  const web3Provider = await getWeb3ProviderByWallet({
    chainId, RPCUrl
  }, 'WalletConnect') as providers.Web3Provider

  const walletConnectProvider = web3Provider.provider as WalletConnectProvider

  if (!walletConnectProvider.wc.connected) {
    await walletConnectProvider.wc.createSession({ chainId: Number(Object.keys(walletConnectProvider.rpc!)[0]) })
  }

  walletConnectProvider.enable()
    .then(accounts => {
      const [account] = accounts
      dispatch(setAccount(account))
      dispatch(setSelectedWallet('WalletConnect'))
    })
    .catch(error => {
      console.log(error)
    })
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
