import { lazy } from 'react'
import { ConfigType } from './config'
// @ts-ignore
const BNBIcon = lazy(() => import('./src/img/liquidityProvider/bnb.png'))
// @ts-ignore
const DOWSIcon = lazy(() => import('./src/img/dows-info/dows.png'))

const config: ConfigType = {
  bridge: {
    apiBaseUrl: 'https://bridge.poly.network/testnet/v1',
    ethereumChainId: 3,
    binanceSmartChainId: 97
  },
  liquidityProvider: {
    supportedPools: [
      {
        poolNumber: 0,
        poolName: 'Pancake Swap LP',
        leftCurrency: {
          name: 'DOWS',
          icon: DOWSIcon
        },
        rightCurrency: {
          name: 'BNB',
          icon: BNBIcon
        },
        lpTokenContractAddress: '0xA327906d3407e1ba1276eB1cBEeaBBF5F33cCb3F',
        farmContractAddress: '0xE86F343E3F5f988eDc6007494127A8B7c7F4E61c',
        poolType: 'pair'
      },
      {
        poolNumber: 0,
        poolName: 'Single Token Yield',
        rightCurrency: {
          name: 'DOWS',
          icon: DOWSIcon
        },
        lpTokenContractAddress: '0x40D34A92435c7699E63C20A79F95eE3b226b67f6',
        farmContractAddress: '0x5FE75A88999b8b58f98bF458c8252209CA1f332d',
        poolType: 'single'
      }
    ]
  }
}

export default config
