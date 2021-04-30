import { providers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'

export const WalletConnectWeb3Provider: any = ({ chainId, RPCUrl }) => {
  let provider
  if (!provider) {

    provider = new WalletConnectProvider({
      bridge: 'https://bridge.walletconnect.org',
      pollingInterval: 12000,
      qrcode: true,
      rpc: {
        [chainId]: RPCUrl
      }
    })
  }

  return new providers.Web3Provider(provider)
}

