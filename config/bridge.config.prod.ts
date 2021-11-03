import { BridgeConfig } from '../config'
import { EthereumChain, getEthereumChainById } from '../src/ShadowsJs/networkHelper'

const PolyChainId = {
  Eth: 2,
  Bsc: 6
}

const bridge: BridgeConfig = {
  ethChain: getEthereumChainById('0x1') as EthereumChain,
  apiBaseUrl: 'https://bridge.poly.network/v1',
  polyChainId: PolyChainId,
  polyChainExplorerUrl: 'https://explorer.poly.network',
  polyChains: [
    {
      polyChainId: PolyChainId.Eth,
      explorerUrl: 'https://etherscan.io',
      lockContractAddress: '0x2aA63cd0b28FB4C31fA8e4E95Ec11815Be07b9Ac',
      dowsTokenAddress: '661ab0ed68000491d98c796146bcf28c20d7c559',
      icon: 'https://i.loli.net/2021/05/08/BOVfya3xrt5uG9I.png',
      ethereumChain: getEthereumChainById('0x1')!
    },
    {
      polyChainId: PolyChainId.Bsc,
      explorerUrl:'https://bscscan.com',
      lockContractAddress: '0xE3D0FB6E3cB5DA61EB18b06D035052441009d1E6',
      dowsTokenAddress: 'fb7400707df3d76084fbeae0109f41b178f71c02',
      icon: 'https://i.loli.net/2021/05/08/T4Dh9bBJyiQN2IA.png',
      ethereumChain: getEthereumChainById('0x38')!
    }
  ]
}

export default bridge
