import { PoolConfig } from '@/types/LiquidityProvider'

import eth from '@/img/liquidityProvider/eth.png'
import dowsIcon from '@/img/dows-info/dows.png'

type Config = {
  liquidityProvider: {
    supportedPools: PoolConfig[]
  }
}

const config: Config = {
  liquidityProvider: {
    supportedPools: [
      {
        poolNumber: 0,
        poolName: 'Pancake Swap LP',
        leftCurrency: {
          name: 'DOWS',
          icon: dowsIcon
        },
        rightCurrency: {
          name: 'ETH',
          icon: eth
        },
        lpTokenContractAddress: '0xA327906d3407e1ba1276eB1cBEeaBBF5F33cCb3F',
        farmContractAddress: '0xE86F343E3F5f988eDc6007494127A8B7c7F4E61c',
      },
      {
        poolNumber: 0,
        poolName: 'Pancake Swap LP',
        rightCurrency: {
          name: 'DOWS',
          icon: dowsIcon
        },
        lpTokenContractAddress: '0x40D34A92435c7699E63C20A79F95eE3b226b67f6',
        farmContractAddress: '0x5FE75A88999b8b58f98bF458c8252209CA1f332d',
      }
    ]
  }
}

export default config
