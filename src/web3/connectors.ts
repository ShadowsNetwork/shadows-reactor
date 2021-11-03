/*eslint-disable no-unused-vars*/
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { Web3Provider } from '@ethersproject/providers'
import { AbstractConnector } from '@web3-react/abstract-connector'
import MetamaskIcon from '@/img/wallet/metamask.svg'
import WalletConnectIcon from '@/img/wallet/walletconnect.svg'
import { providers } from 'ethers'
import web3 from 'web3'
import { ConfigType } from '../../config'

const config = process.env.CONTRACT_CONFIG as unknown as ConfigType

const POLLING_INTERVAL = 12000

export type Wallet = {
  name: string
  connectorName: ConnectorNames,
  icon: string,
  connector: AbstractConnector
}

export enum ConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
}

export const DEFAULT_PROVIDER = new providers.Web3Provider(new web3.providers.HttpProvider(config.ethChain.rpcUrls[0]) as any)

export const injected = new InjectedConnector({})

console.log({
  [parseInt(config.ethChain.chainId, 16)]: config.ethChain.rpcUrls[0],
  [parseInt(config.bridge.ethChain.chainId, 16)]: config.bridge.ethChain.rpcUrls[0],
})

console.log({
  [parseInt(config.ethChain.chainId, 16)]: config.ethChain.rpcUrls[0],
  [parseInt(config.bridge.ethChain.chainId, 16)]: config.bridge.ethChain.rpcUrls[0],
})

const walletconnect = new WalletConnectConnector({
  rpc: {
    [parseInt(config.ethChain.chainId, 16)]: config.ethChain.rpcUrls[0],
    [parseInt(config.bridge.ethChain.chainId, 16)]: config.bridge.ethChain.rpcUrls[0],
  },
  qrcode: true,
  // pollingInterval: POLLING_INTERVAL,
})

export const connectorsByName: { [connectorName in ConnectorNames]: AbstractConnector } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
}

export const supportWallets: Wallet[] = [
  {
    name: 'MetaMask',
    connectorName: ConnectorNames.Injected,
    icon: MetamaskIcon,
    connector: injected
  },
  {
    name: 'WalletConnect',
    connectorName: ConnectorNames.WalletConnect,
    icon: WalletConnectIcon,
    connector: walletconnect
  }
]

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}
