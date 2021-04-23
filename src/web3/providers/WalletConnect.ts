import { providers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'

export const WalletConnectWeb3Provider: any = () => {
  const chainId: number = parseInt(process.env.CHAIN_ID!, 16)
  const RPCUrl: string = process.env.RPC_URL!

  const provider = new WalletConnectProvider({
    bridge: 'https://bridge.walletconnect.org',
    pollingInterval: 12000,
    qrcode: true,
    rpc: {
      [chainId]: RPCUrl
    }
  })
  return new providers.Web3Provider(provider)
}

