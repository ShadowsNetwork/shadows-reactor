import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'

const POLLING_INTERVAL = 12000

const chainId = parseInt(process.env.CHAIN_ID ?? '0x61', 10)

// const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]

// const rpcUrl: string = (() => {
// const randomIndex = random(0, nodes.length - 1)
// return nodes[randomIndex] ?? 'https://bsc-dataseed.binance.org'
// })()
const rpcUrl = process.env.RPC_URL ?? 'https://data-seed-prebsc-1-s1.binance.org:8545/'

const injectedConnector = new InjectedConnector({ supportedChainIds: [chainId] })

const walletConnectConnector = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})

const bscConnector = new BscConnector({ supportedChainIds: [chainId] })

export type ConnectorNames = 'injected' | 'bsc' | 'wallet-connect'

export function getConnectorByName(name?: ConnectorNames): AbstractConnector | undefined {
  if (!name) {
    return undefined
  }

  const map = new Map<ConnectorNames, AbstractConnector>([
    ['injected', injectedConnector],
    ['bsc', bscConnector],
    ['wallet-connect', walletConnectConnector]
  ])

  return map[name]
}
