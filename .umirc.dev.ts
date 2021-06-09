import { defineConfig } from 'umi'

import config from './config.dev'

export default defineConfig({
  define: {
    'process.env.CHAIN_ID': '0x61',
    'process.env.NETWORK_NAME': 'Binance Smart Chain Testnet',
    'process.env.RPC_URL': 'https://data-seed-prebsc-2-s1.binance.org:8545//',
    'process.env.BLOCK_EXPLORER_URL': 'https://testnet.bscscan.com',
    'process.env.CONTRACT_CONFIG': config
  }
  /*define: {
    'process.env.CHAIN_ID': '0x3',
    'process.env.NETWORK_NAME': 'Ropsten',
    'process.env.RPC_URL': 'https://ropsten.infura.io/v3/undefined',
    'process.env.BLOCK_EXPLORER_URL': 'https://ropsten.etherscan.io',
    'process.env.CONTRACT_CONFIG': config
  }*/
})
