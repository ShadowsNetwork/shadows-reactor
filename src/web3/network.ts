import { message } from 'antd'

export type SupportedEthereumChainId = '0x1' | '0x38' | '0x3' | '0x61'

export type EthereumChain = {
  chainId: SupportedEthereumChainId,  // hex string
  chainName: string,
  key: string,
  nativeCurrency?: {
    name: string,
    symbol: string,
    decimals: number
  },
  rpcUrls: string[],
  blockExplorerUrls: string[]
}

// eslint-disable-next-line no-unused-vars
export const SUPPORTED_ETHEREUM_CHAINS: { [key in SupportedEthereumChainId]: EthereumChain } = {
  '0x1': {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    key: 'mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'eth',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3/undefined'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  '0x38': {
    chainId: '0x38',
    chainName: 'BSC Mainnet',
    key: 'bsc',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed1.ninicoin.io'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  '0x3': {
    chainId: '0x3',
    chainName: 'Ethereum Ropsten',
    key: 'ropsten',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'eth',
      decimals: 18
    },
    rpcUrls: ['https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://ropsten.etherscan.io']
  },
  '0x61': {
    chainId: '0x61',
    chainName: 'BSC Testnet',
    key: 'bsctestnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com']
  }
}

export async function setupMetamaskNetwork(props: { chain: EthereumChain }): Promise<void> {
  const { chain } = props

  const provider = (window as WindowChain).ethereum

  if (!provider) {
    message.error('Can\'t setup network on MetaMask because window.ethereum is undefined. Maybe you can install MetaMask first.')
    return
  }

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const { key, ...params } = chain

  return await provider.request({
    method: 'wallet_addEthereumChain',
    params: [params]
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
      return
    })
}

export async function setupWalletConnectNetwork(props: { chain: EthereumChain }) {
  const { chain } = props

  message.warn(`Please manually switch to the ${chain.chainName} in your WalletConnect App, and then try to re-connect.`, 5)
}

export async function setupBSCWalletNetwork(props: { chain: EthereumChain }) {
  const { chain } = props

  const supportChainIdList: string[] = ['0x38', '0x61', '0x1']

  if (!supportChainIdList.includes(chain.chainId)) {
    message.warn(`Binance Chain Wallet does NOT support for ${chain.chainName}`)
    return false
  }

  message.warn(`Please manually switch to the ${chain.chainName} in Binance Chain Wallet`, 5)
  return false
}

// type NetworkFixupMethodProps = {
//   chain: EthereumChain
//   connector: AbstractConnector
// }
//
// export const networkFixupMethodByWallet: { [key in WalletKeys]?: (args: NetworkFixupMethodProps) => void} = {
//   // WalletConnect: setupWalletConnectNetwork,
//   MetaMask: setupMetamaskNetwork,
//   BSC: setupBSCWalletNetwork
// }
