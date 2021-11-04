/*eslint-disable no-unused-vars*/
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { Web3Provider } from '@ethersproject/providers'
import { AbstractConnector } from '@web3-react/abstract-connector'
import MetamaskIcon from '@/img/wallet/metamask.svg'
import WalletConnectIcon from '@/img/wallet/walletconnect.svg'
import BscWalletIcon from '@/img/wallet/bsc.png'
import { providers } from 'ethers'
import web3 from 'web3'
import { BscConnector } from '@binance-chain/bsc-connector'

import config from '@/config'

// const POLLING_INTERVAL = 12000

export enum WalletKeys {
  MetaMask = 'MetaMask',
  BSC = 'BSC',
  WalletConnect = 'WalletConnect',
}

export type Wallet = {
  key: WalletKeys,
  name: string
  icon: string,
  connector: AbstractConnector
}

export const DEFAULT_PROVIDER = new providers.Web3Provider(new web3.providers.HttpProvider(config.ethChain.rpcUrls[0]) as any)

export const injected = new InjectedConnector({})

const bscConnector = new BscConnector({})

const walletconnect = new WalletConnectConnector({
  rpc: {
    [parseInt(config.ethChain.chainId, 16)]: config.ethChain.rpcUrls[0],
    [parseInt(config.bridge.ethChain.chainId, 16)]: config.bridge.ethChain.rpcUrls[0],
  },
  qrcode: true,
})

export const connectorsByWallet: { [connectorName in WalletKeys]: AbstractConnector } = {
  [WalletKeys.MetaMask]: injected,
  [WalletKeys.BSC]: bscConnector,
  [WalletKeys.WalletConnect]: walletconnect,
}

export const supportWallets: Wallet[] = [
  {
    name: 'MetaMask',
    key: WalletKeys.MetaMask,
    icon: MetamaskIcon,
    connector: injected
  },
  {
    name: 'WalletConnect',
    key: WalletKeys.WalletConnect,
    icon: WalletConnectIcon,
    connector: walletconnect
  },
  {
    name: 'Binance Chain Wallet',
    key: WalletKeys.BSC,
    icon: BscWalletIcon,
    connector: bscConnector
  }
]

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}
