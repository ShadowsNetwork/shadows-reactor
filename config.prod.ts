import { lazy } from 'react'
import { ConfigType } from './config'
// @ts-ignore
const BNBIcon = lazy(() => import('./src/img/liquidityProvider/bnb.png'))
// @ts-ignore
const DOWSIcon = lazy(() => import('./src/img/dows-info/dows.png'))

const config: ConfigType = {
  bridge: { apiBaseUrl: 'https://bridge.poly.network/v1' },
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
        lpTokenContractAddress: '0x6d611e5eb40e8a36f97cda481612688025d8cb0e',
        farmContractAddress: '0x51B9234182155287B9311f77cF4077B2EaDA442A',
        poolType: 'pair',
        lpMultiplier: 50.3698,
      },
      {
        poolNumber: 1,
        poolName: 'Single Token Yield',
        rightCurrency: {
          name: 'DOWS',
          icon: DOWSIcon
        },
        lpTokenContractAddress: '0xfb7400707df3d76084fbeae0109f41b178f71c02',
        farmContractAddress: '0x51B9234182155287B9311f77cF4077B2EaDA442A',
        poolType: 'single',
        lpMultiplier: 1,
      }
    ]
  }
}

export default config
