import { EthereumChainParams } from '@/ShadowsJs/networkHelper'

import EthereumIcon from '@/img/bridge/ethereum.png'
import BSCIcon from '@/img/bridge/bsc.png'

export const PolyChainId = {
  Eth: 2,
  Bsc: /*TARGET_MAINNET ? 6 : */79
}

export type PolyChain = {
  polyChainId: number
  ethereumChain: EthereumChainParams
  networkChainId: number
  explorerUrl: string
  lockContractAddress: string
  dowsTokenAddress: string
  icon: any
}

export const POLY_CHAINS: PolyChain[] = [
  {
    polyChainId: PolyChainId.Eth,
    networkChainId: 3,
    explorerUrl: /*TARGET_MAINNET
      ? 'https://etherscan.io/tx/0x{txHash}'
      : */'https://ropsten.etherscan.io/tx/0x{txHash}',
    lockContractAddress: /*TARGET_MAINNET
      ? '0x2aA63cd0b28FB4C31fA8e4E95Ec11815Be07b9Ac'
      : */'0xe498fb7D00468a67A79dE5D4Ca264d3350165280',
    dowsTokenAddress: 'f888798ef5b0c3658242e53b00c7a9999205ccd4',
    icon: EthereumIcon,
    ethereumChain: {
      chainId: '0x3',
      chainName: 'Ethereum Ropsten',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'eth',
        decimals: 18
      },
      rpcUrls: ['https://ropsten.infura.io/v3/undefined'],
      blockExplorerUrls: ['https://ropsten.etherscan.io']
    }
  },
  {
    polyChainId: PolyChainId.Bsc,
    networkChainId: 97,
    explorerUrl: /*TARGET_MAINNET
      ? 'https://bscscan.com/tx/0x{txHash}'
      : */'https://testnet.bscscan.com/tx/0x{txHash}',
    lockContractAddress: /*TARGET_MAINNET
      ? '0xE3D0FB6E3cB5DA61EB18b06D035052441009d1E6'
      : */'0xCed7997C3e807Fcdc5ac18fFC0B8af93a15a9eE5',
    dowsTokenAddress: 'd2c4636d6551adf0c64f37e2acce92ad33804e6b',
    icon: BSCIcon,
    ethereumChain: {
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
  }
]
