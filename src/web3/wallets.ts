import MetamaskIcon from '@/img/wallet/metamask.svg'
import BSCIcon from '@/img/wallet/bsc.png'
import WalletConnectIcon from '@/img/wallet/walletconnect.svg'
import { setAccount, setSelectedWallet } from '@/store/wallet'
import { providers } from 'ethers'
import { chainSupported, setupNetwork } from '@/ShadowsJs/networkHelper'
import { Dispatch } from 'redux'
import { MetamaskWeb3Provider } from './providers/Metamask'
import { WalletConnectWeb3Provider } from './providers/WalletConnect'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { BscWeb3Provider } from '@/web3/providers/BSC'

export type WalletNames = 'Metamask' | 'BSC' | 'WalletConnect'

export interface Wallet {
  name: string
  icon: string,
  handleConnect: (_dispatch: Dispatch<any>) => void
}

export async function getWeb3ProviderByWallet(walletName?: WalletNames): Promise<providers.Web3Provider | undefined> {
  if (!walletName) {
    return undefined
  }

  return await (new Map<WalletNames, any>([
    ['Metamask', MetamaskWeb3Provider],
    ['BSC', BscWeb3Provider],
    ['WalletConnect', WalletConnectWeb3Provider]
  ]).get(walletName))()
}

const connectToMetamask = async (dispatch: Dispatch<any>): Promise<void> => {
  const provider = await getWeb3ProviderByWallet('Metamask') as providers.Web3Provider

  provider.ready.then(async network => {
    const { chainId } = network
    if (!chainSupported(chainId)) {
      await setupNetwork()
    }

    provider.provider.request?.({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log('on request eth_requestAccounts callback, ', accounts)
        const [account] = accounts
        dispatch(setAccount(account))
        dispatch(setSelectedWallet('Metamask'))
      })
  })
}

const connectToBSC = async (dispatch: Dispatch<any>): Promise<void> => {
  const web3Provider = await getWeb3ProviderByWallet('BSC') as providers.Web3Provider

  const bscProvider = web3Provider.provider
  // @ts-ignore
  const accounts = await bscProvider.enable()
  const [account] = accounts
  dispatch(setAccount(account))
  dispatch(setSelectedWallet('BSC'))
  /*bscConnector.activate()
    .then(async r => {
      const { account, provider } = r
      const web3Provider = new ethers.providers.Web3Provider(provider, 'any')
      dispatch(setAccount(account))
      dispatch(setSelectedWallet('BSC'))

      setSigner({
        networkId: 97,
        signer: web3Provider.getSigner()
      })
    })*/
}

const connectToWalletConnect = async (dispatch: Dispatch<any>): Promise<void> => {
  const web3Provider = await getWeb3ProviderByWallet('WalletConnect') as providers.Web3Provider

  const walletConnectProvider = web3Provider.provider as WalletConnectProvider

  if (!walletConnectProvider.wc.connected) {
    await walletConnectProvider.wc.createSession({ chainId: Number(Object.keys(walletConnectProvider.rpc!)[0]) })
  }
  // if (walletConnectProvider.connected || walletConnectProvider.wc.connected) {
  //   await walletConnectProvider.wc.killSession()
  // }

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
