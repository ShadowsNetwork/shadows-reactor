import { lazy } from 'react'
import { ConfigType } from './config'
// @ts-ignore
const BNBIcon = lazy(() => import('./src/img/liquidityProvider/bnb.png'))
// @ts-ignore
const DOWSIcon = lazy(() => import('./src/img/dows-info/dows.png'))

const config: ConfigType = {
  bridge: {
    apiBaseUrl: 'https://bridge.poly.network/testnet/v1',
  },
  liquidityProvider: {
    supportedPools: [
      {
        poolNumber: 0,
        poolName: 'Pancake Swap LP',
        tokenName: 'LPPair',
        leftCurrency: {
          name: 'DOWS',
          icon: DOWSIcon
        },
        rightCurrency: {
          name: 'BNB',
          icon: BNBIcon
        },
        lpTokenContractAddress: '0xA327906d3407e1ba1276eB1cBEeaBBF5F33cCb3F',
        farmContractAddress: '0x5C0b69BeE27f5F4e1eF654c1E5eEc106A33f2eA5',
        poolType: 'pair',
        lpMultiplier: 2,
      },
      {
        poolNumber: 1,
        poolName: 'Single Token Yield',
        tokenName: 'DOWS',
        rightCurrency: {
          name: 'DOWS',
          icon: DOWSIcon
        },
        lpTokenContractAddress: '0x40D34A92435c7699E63C20A79F95eE3b226b67f6',
        farmContractAddress: '0x5C0b69BeE27f5F4e1eF654c1E5eEc106A33f2eA5',
        poolType: 'single',
        lpMultiplier: 1,
      }
    ]
  }
}

export default config
