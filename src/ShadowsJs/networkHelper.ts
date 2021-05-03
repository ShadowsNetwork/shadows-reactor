// import { NETWORK_SPEEDS_TO_KEY, GWEI_UNIT, GAS_LIMIT_BUFFER_PERCENTAGE } from '../constants/network'

import { Web3Provider } from '@ethersproject/providers'
import { message } from 'antd'
import WalletConnectProvider from '@walletconnect/web3-provider'

export const SUPPORTED_NETWORKS = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  5: 'goerli',
  42: 'kovan',
  97: 'bsctestnet',
  56: 'bsc'
}

/*export const SUPPORTED_NETWORKS = {
  1: 'MAINNET',
  3: 'ROPSTEN',
  4: 'RINKEBY',
  5: 'GOERLI',
  42: 'KOVAN'
}

export const NETWORK_NAMES = {
  1: 'HOMESTEAD',
  3: 'ROPSTEN',
  4: 'RINKEBY',
  5: 'GOERLI',
  42: 'KOVAN'
}

// export const SUPPORTED_NETWORKS_MAP = invert(SUPPORTED_NETWORKS)

export const DEFAULT_GAS_LIMIT = {
  mint: 2200000,
  burn: 2200000,
  claim: 1400000,
  exchange: 220000,
  sendSNX: 120000,
  sendEth: 21000,
  sendSynth: 150000
}*/

/*export const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID

export const INFURA_JSON_RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  3: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  5: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
  42: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`
}

export const PORTIS_APP_ID = '81b6e4b9-9f28-4cce-b41f-2de90c4f906f'

const DEFIPULSE_API_KEY = process.env.REACT_APP_DEFIPULSE_API_KEY*/

/* const ETH_GAS_STATION_URL = `https://ethgasstation.info/api/ethgasAPI.json?api-key=${DEFIPULSE_API_KEY}`
 const GAS_NOW_URL = 'https://www.gasnow.org/api/v3/gas/price?utm_source=mintr'

export const SUPPORTED_WALLETS_MAP = {
  METAMASK: 'Metamask',
  TREZOR: 'Trezor',
  LEDGER: 'Ledger',
  COINBASE: 'Coinbase',
  WALLET_CONNECT: 'WalletConnect',
  PORTIS: 'Portis'
}*/

/*export const OVM_RPC_URL = 'https://goerli.optimism.io'

export const L1_MESSENGER_ADDRESS = '0x5DC986a160add9865D9154BbdF1aa2995D09Ec06'

export const L2_MESSENGER_ADDRESS = '0xD8538fABbf7c2538234BcF92FF9D5C3ECA9DBF22'

export const SUPPORTED_WALLETS = Object.values(SUPPORTED_WALLETS_MAP)

export const BLOCKNATIVE_KEY = process.env.REACT_APP_BLOCKNATIVE_NOTIFY_KEY

export const hasEthereumInjected = () => !!window.ethereum

const defaultNetwork = {
  name: 'MAINNET',
  networkId: 1
}*/

/*export async function getEthereumNetwork() {
  if (!hasEthereumInjected()) {
    return defaultNetwork
  }
  let networkId = 1
  try {
    console.log(window.ethereum)
    if (window.ethereum?.networkVersion) {
      networkId = Number(window.ethereum?.networkVersion)
      return {
        name: SUPPORTED_NETWORKS[networkId],
        networkId
      }
    }
    // if (window.web3?.eth?.net) {
    //   networkId = await window.web3.eth.net.getId()
    //   return {
    //     name: SUPPORTED_NETWORKS[networkId],
    //     networkId: Number(networkId),
    //   }
    // }
    // if (window.web3?.version?.network) {
    //   networkId = Number(window.web3.version.network)
    //   return {
    //     name: SUPPORTED_NETWORKS[networkId],
    //     networkId,
    //   }
    // }
    return defaultNetwork
  } catch (e) {
    console.log(e)
    return defaultNetwork
  }
}*/

/*export const getTransactionPrice = (gasPrice, gasLimit, ethPrice) => {
  if (!gasPrice || !gasLimit) return 0
  return (gasPrice * ethPrice * gasLimit) / 1000000000
}*/

/* export function onMetamaskAccountChange(cb) {
  if (!window.ethereum) return
  const listener = throttle(cb, 1000)
  window.ethereum.on('accountsChanged', listener)
} */

/*export function onMetamaskNetworkChange() {
  if (!window.ethereum) return
  window.ethereum.on('chainChanged', () => {
    document.location.reload()
  })
}*/

export type EthereumChainParams = {
  chainId: string,
  chainName: string,
  nativeCurrency?: {
    name: string,
    symbol: string,
    decimals: number
  },
  rpcUrls: string[],
  blockExplorerUrls: string[]
}

export async function setupMetamaskNetwork(params: EthereumChainParams) {
  const provider = (window as WindowChain).ethereum
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [params]
      })
      return true
    } catch (error) {
      if (error.message.includes('May not specify default MetaMask chain.')) {
        message.warn(`Please manually switch to the ${params.chainName} in MetaMask`, 5)
      }

      if (error.message.includes('User rejected the request.')) {
        message.warn('Please allow switching network in Metamask')
        setTimeout(() => {
          setupMetamaskNetwork(params)
        }, 1000)
      }
      return false
    }
  } else {
    console.error('Can\'t setup the BSC network on metamask because window.ethereum is undefined')
    return false
  }
}

export async function setupWalletConnectNetwork(params: EthereumChainParams, web3Provider: Web3Provider) {
  const provider = web3Provider.provider as WalletConnectProvider
  if (provider.wc.chainId !== parseInt(params.chainId, 16)) {
    message.warn(`Please manually switch to the ${params.chainName} in your WalletConnect App, and then try to re-connect.`, 5)
    provider.wc.killSession()
    provider.close()

    setTimeout(() => {
      window.location.reload()
    }, 5000)

    return false
  } else {
    await provider.enable()
    return true
  }
}

export async function setupBSCNetwork(params: EthereumChainParams) {
  const supportChainIdList = [parseInt(process.env.CHAIN_ID!, 16)]

  if (!supportChainIdList.includes(parseInt(params.chainId, 16))) {
    message.warn(`Binance Chain Wallet does NOT support for ${params.chainName}`)
    return false
  }

  message.warn(`Please manually switch to the ${params.chainName} in Binance Chain Wallet`, 5)
  return false
}

// export const addBufferToGasLimit = gasLimit => Math.round(Number(gasLimit) * (1 + 0.2))

/* export const isMainNet = networkId => networkId === Number(SUPPORTED_NETWORKS_MAP.MAINNET)

export const isGoerliTestnet = networkId => networkId === Number(SUPPORTED_NETWORKS_MAP.GOERLI) */
