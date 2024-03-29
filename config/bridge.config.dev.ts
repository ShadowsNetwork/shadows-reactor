import { BridgeConfig } from '../config'
import { SUPPORTED_ETHEREUM_CHAINS } from '../src/web3/network'

const PolyChainId = {
  Eth: 2,
  Bsc: 79
}

const bridge: BridgeConfig = {
  ethChain: SUPPORTED_ETHEREUM_CHAINS['0x3'],
  apiBaseUrl: 'https://bridge.poly.network/testnet/v1',
  polyChainId: PolyChainId,
  polyChainExplorerUrl: 'https://explorer.poly.network/testnet',
  polyChains: [
    {
      polyChainId: PolyChainId.Eth,
      explorerUrl: 'https://ropsten.etherscan.io',
      lockContractAddress: '0xe498fb7D00468a67A79dE5D4Ca264d3350165280',
      dowsTokenAddress: 'f888798ef5b0c3658242e53b00c7a9999205ccd4',
      icon: 'https://i.loli.net/2021/05/08/BOVfya3xrt5uG9I.png',
      ethereumChain: SUPPORTED_ETHEREUM_CHAINS['0x3']
    },
    {
      polyChainId: PolyChainId.Bsc,
      explorerUrl: 'https://testnet.bscscan.com',
      lockContractAddress: '0xCed7997C3e807Fcdc5ac18fFC0B8af93a15a9eE5',
      dowsTokenAddress: 'd2c4636d6551adf0c64f37e2acce92ad33804e6b',
      icon: 'https://i.loli.net/2021/05/08/T4Dh9bBJyiQN2IA.png',
      ethereumChain: SUPPORTED_ETHEREUM_CHAINS['0x61']
    }
  ]
}

export default bridge
