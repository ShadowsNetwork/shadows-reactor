import { ConfigType } from './config'

import bridgeConfig from './config/bridge.config.dev'

const config: ConfigType = {
  baseUrl : 'http://127.0.0.1:3000',
  bridge: bridgeConfig,
  liquidityProvider: {
    supportedPools: [
      {
        poolNumber: 0,
        poolName: 'Pancake Swap LP',
        tokenName: 'LPPair',
        leftCurrency: {
          name: 'DOWS',
          icon: 'https://i.loli.net/2021/05/08/ZP9Xg4LszRTiIcV.png'
        },
        rightCurrency: {
          name: 'BNB',
          icon: 'https://i.loli.net/2021/05/08/34N7vOpUnADeEy2.png'
        },
        lpTokenContractAddress: '0xA327906d3407e1ba1276eB1cBEeaBBF5F33cCb3F',
        farmContractAddress: '0x5C0b69BeE27f5F4e1eF654c1E5eEc106A33f2eA5',
        poolType: 'pair',
        lpMultiplier: 2
      },
      {
        poolNumber: 1,
        poolName: 'Single Token Yield',
        tokenName: 'DOWS',
        rightCurrency: {
          name: 'DOWS',
          icon: 'https://i.loli.net/2021/05/08/ZP9Xg4LszRTiIcV.png'
        },
        lpTokenContractAddress: '0x40D34A92435c7699E63C20A79F95eE3b226b67f6',
        farmContractAddress: '0x5C0b69BeE27f5F4e1eF654c1E5eEc106A33f2eA5',
        poolType: 'single',
        lpMultiplier: 1
      }
    ]
  }
}

export default config
