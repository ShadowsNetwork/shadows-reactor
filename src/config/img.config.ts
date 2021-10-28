import bscConfig from './bsc/config'
import bsctestnetConfig from './bsctestnet/config'

export type ShadowsSynth = {
  name: string,
  symbol: string,
  address?: string,
  coingecko: string,
  isContractUpdate?: boolean
  isCoingeckoSql?: boolean,
  type?: string
}

function getShadowsSynthsConfig() {
  const network = process.env.NETWORK
  if (network === 'bsc') {
    return bscConfig
  } else if (network === 'bsctestnet') {
    return bsctestnetConfig
  } else {
    return []
  }
}

export const shadowsSynthsConfig = getShadowsSynthsConfig()
