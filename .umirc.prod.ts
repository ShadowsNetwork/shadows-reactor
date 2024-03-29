import { defineConfig } from 'umi'

import config from './config.prod'

export default defineConfig({
  define: {
    'process.env.NETWORK': 'bsc',
    'process.env.CHAIN_ID': '0x38',
    'process.env.NETWORK_NAME': 'Binance Smart Chain Mainnet',
    'process.env.RPC_URL': 'https://bsc-dataseed1.ninicoin.io',
    'process.env.BLOCK_EXPLORER_URL': 'https://bscscan.com/',
    'process.env.CONTRACT_CONFIG': config
  }
})
