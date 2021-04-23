import { defineConfig } from 'umi'

export default defineConfig({
  define: {
    'process.env.CHAIN_ID': '0x61',
    'process.env.NETWORK_NAME': 'Binance Smart Chain Testnet',
    'process.env.RPC_URL': 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    'process.env.BLOCK_EXPLORER_URL': 'https://testnet.bscscan.com'
  }
})
