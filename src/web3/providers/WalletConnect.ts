import { providers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'

export const WalletConnectWeb3Provider: any = () => {
  const provider = new WalletConnectProvider({
    bridge: 'https://bridge.walletconnect.org',
    pollingInterval: 12000,
    qrcode: true,
    rpc: {
      97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    }
  })
  return new providers.Web3Provider(provider)
}

