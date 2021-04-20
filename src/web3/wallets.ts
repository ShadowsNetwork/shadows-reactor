import MetamaskIcon from '@/img/wallet/metamask.png'
import BSCIcon from '@/img/wallet/bsc.png'
import WalletConnectIcon from '@/img/wallet/wallet-connect.png'
import { setAccount, setSelectedWallet } from '@/store/wallet'
import { providers } from 'ethers'
import { chainSupported, setupNetwork } from '@/ShadowsJs/networkHelper'
import { Dispatch } from 'redux'
import { MetamaskWeb3Provider } from './providers/Metamask'
import { WalletConnectWeb3Provider } from './providers/WalletConnect'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { BscWeb3Provider } from '@/web3/providers/BSC'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'

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

  })
}

const connectToWalletConnect = async (dispatch: Dispatch<any>): Promise<void> => {
  const web3Provider = await getWeb3ProviderByWallet('WalletConnect') as providers.Web3Provider

  const walletConnectProvider = web3Provider.provider as WalletConnectProvider

  console.log(walletConnectProvider)

  if (walletConnectProvider.connected || walletConnectProvider.wc.connected) {
    await walletConnectProvider.wc.killSession()
  }

  walletConnectProvider.enable()
    .then(accounts => {
      const [account] = accounts
      dispatch(setAccount(account))
      dispatch(setSelectedWallet('WalletConnect'))

      dowsJSConnector.setContractSettings({
        networkId: 97,
        provider: web3Provider,
        signer: web3Provider.getSigner ? web3Provider.getSigner() : null
      })
    })
    .catch(error => {
      console.log(error)
    })

  walletConnectProvider.on('disconnect', (code: number, reason: string) => {
    console.log(code, reason)
    dispatch(setAccount(null))
    dispatch(setSelectedWallet(null))
  })

  walletConnectProvider.on('accountsChanged', accounts => {
    console.log('accountsChanged: ', accounts)
    const [account] = accounts
    dispatch(setAccount(account))
    dispatch(setSelectedWallet('WalletConnect'))
  })

}

const connectToBSC = async (dispatch: Dispatch<any>): Promise<void> => {
  const web3Provider = await getWeb3ProviderByWallet('BSC') as providers.Web3Provider
  console.log(web3Provider)

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
