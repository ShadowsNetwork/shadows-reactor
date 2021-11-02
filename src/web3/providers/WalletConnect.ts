import { providers } from 'ethers'
import WalletConnectProvider from '@walletconnect/ethereum-provider'

export const WalletConnectWeb3Provider: any = ({
  chainId: chainIdArg, RPCUrl
}) => {
  let provider

  const chainId = chainIdArg.toString().startsWith('0x') ? parseInt(chainIdArg, 16) : chainIdArg

  if (!provider) {
    provider = new WalletConnectProvider({
      qrcode: true,
      chainId,
      rpc: {
        [chainId]: RPCUrl
      }
    })
  }

  return new providers.Web3Provider(provider)
}

