// import { NETWORK_SPEEDS_TO_KEY, GWEI_UNIT, GAS_LIMIT_BUFFER_PERCENTAGE } from '../constants/network'

import { Web3Provider } from '@ethersproject/providers'
import { message } from 'antd'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { providers } from 'ethers'

export const SUPPORTED_NETWORKS = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  5: 'goerli',
  42: 'kovan',
  97: 'bsctestnet',
  56: 'bsc'
}

export type SupportedEthereumChainId = '0x1' | '0x38' | '0x3' | '0x61'

export type EthereumChain = {
  chainId: SupportedEthereumChainId,  // hex string
  chainName: string,
  nativeCurrency?: {
    name: string,
    symbol: string,
    decimals: number
  },
  rpcUrls: string[],
  blockExplorerUrls: string[]
}

export const SUPPORTED_ETHEREUM_CHAINS: EthereumChain[] = [
  {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'eth',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3/undefined'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  {
    chainId: '0x38',
    chainName: 'BSC Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed1.ninicoin.io'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  {
    chainId: '0x3',
    chainName: 'Ethereum Ropsten',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'eth',
      decimals: 18
    },
    rpcUrls: ['https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://ropsten.etherscan.io']
  },
  {
    chainId: '0x61',
    chainName: 'BSC Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com']
  }
]

export function getEthereumChainById(id?: SupportedEthereumChainId): EthereumChain | undefined {
  return SUPPORTED_ETHEREUM_CHAINS.find(o => o.chainId === id)
}

export async function setupMetamaskNetwork(chain: EthereumChain): Promise<boolean> {
  const provider = (window as WindowChain).ethereum

  if (!provider) {
    message.error('Can\'t setup network on MetaMask because window.ethereum is undefined. Maybe you can install MetaMask first.')
    return false
  }

  return await provider.request({
    method: 'wallet_addEthereumChain',
    params: [chain]
  })
    .then(async () => {
      const { chainId } = await new providers.Web3Provider(provider).ready

      return chainId === parseInt(chain.chainId, 16)
    })
    .catch(error => {
      // message: May not specify default MetaMask chain.
      if (error.code === -32602) {
        message.warn(`Please manually switch to the ${chain.chainName} in MetaMask`, 5)
        return false
      }

      // message: User rejected the request.
      if (error.code === 4001) {
        message.warn('Please allow switching network in MetaMask')
        return false
      }

      // message: Request of type 'wallet_switchEthereumChain' already pending for origin ******. Please wait.
      if (error.code === -32002) {
        message.warn('Network switching request has been sent to your MetaMask, please check it!', 5)
        return false
      }

      console.log(error)
      return false
    })
}

export async function setupWalletConnectNetwork(params: EthereumChain, web3Provider: Web3Provider) {
  const provider = web3Provider.provider as WalletConnectProvider
  if (provider.wc.chainId !== parseInt(params.chainId, 16)) {
    message.warn(`Please manually switch to the ${params.chainName} in your WalletConnect App, and then try to re-connect.`, 3)
    provider.wc.killSession()
    provider.close()

    setTimeout(() => {
      window.location.reload()
    }, 3000)

    return false
  } else {
    await provider.enable()
    return true
  }
}

export async function setupBinanceWalletNetwork(params: EthereumChain) {
  const supportChainIdList = [parseInt(process.env.CHAIN_ID!, 16)]

  if (!supportChainIdList.includes(parseInt(params.chainId, 16))) {
    message.warn(`Binance Chain Wallet does NOT support for ${params.chainName}`)
    return false
  }

  message.warn(`Please manually switch to the ${params.chainName} in Binance Chain Wallet`, 5)
  return false
}
