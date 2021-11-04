import { ConfigType } from './config'

import bridgeConfig from './config/bridge.config.prod'
import { SUPPORTED_ETHEREUM_CHAINS } from './src/web3/network'

const config: ConfigType = {
  ethChain: SUPPORTED_ETHEREUM_CHAINS['0x38'],
  baseUrl : 'https://api.shadows.link',
  bridge: bridgeConfig,
  liquidityProvider: {
    supportedPools: [
      {
        poolNumber: 0,
        poolName: 'Pancake Swap DOWS LP',
        tokenName: 'LPPair',
        leftCurrency: {
          name: 'DOWS',
          icon: 'https://i.loli.net/2021/05/08/ZP9Xg4LszRTiIcV.png'
        },
        rightCurrency: {
          name: 'BNB',
          icon: 'https://i.loli.net/2021/05/08/34N7vOpUnADeEy2.png'
        },
        lpTokenContractAddress: '0x6d611e5eb40e8a36f97cda481612688025d8cb0e',
        farmContractAddress: '0x51B9234182155287B9311f77cF4077B2EaDA442A',
        poolType: 'pair',
        lpMultiplier: 50.3698,
      },
      {
        poolNumber: 1,
        poolName: 'Single Token Yield',
        tokenName: 'DOWS',
        rightCurrency: {
          name: 'DOWS',
          icon: 'https://i.loli.net/2021/05/08/ZP9Xg4LszRTiIcV.png'
        },
        lpTokenContractAddress: '0xfb7400707df3d76084fbeae0109f41b178f71c02',
        farmContractAddress: '0x51B9234182155287B9311f77cF4077B2EaDA442A',
        poolType: 'single',
        lpMultiplier: 1,
      },
      {
        poolNumber: 2,
        poolName: 'Pancake Swap ShaUsd LP',
        tokenName: 'LPPair',
        leftCurrency: {
          name: 'ShaUsd',
          icon: 'https://i.loli.net/2021/11/02/NsXY8P4Fhilxj2V.png'
        },
        rightCurrency: {
          name: 'BUSD',
          icon: 'https://i.loli.net/2021/11/02/1JkT9tV6SzIqhNX.png'
        },
        lpTokenContractAddress: '0xe4aa6b01b5c2ca61d78de98f7c0d416b26152665',
        farmContractAddress: '0x51B9234182155287B9311f77cF4077B2EaDA442A',
        poolType: 'pair',
        lpMultiplier: 2,
      },
    ]
  }
}

export default config
