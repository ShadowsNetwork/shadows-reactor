export type ShadowsSynth = {
  name: string,
  symbol: string,
  address?: string,
  coingecko: string,
  isContractUpdate?: boolean
  isCoingeckoSql?: boolean,
  type?: string
}

export const shadowsSynthsConfig: Array<ShadowsSynth> = [
  {
    type: 'Crypto',
    name: 'dows',
    coingecko: 'shadows',
    symbol: 'DOWS',
    isContractUpdate: true
  },
  {
    type: 'Crypto',
    coingecko: 'ethereum',
    name: 'eth',
    symbol: 'xETH',
    address: '0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7'
  },
  {
    type: 'Crypto',
    coingecko: 'bitcoin',
    name: 'btc',
    symbol: 'xBTC',
    address: '0x5741306c21795FdCBb9b265Ea0255F499DFe515C'
  },
  {
    type: 'Commodities',
    coingecko: 'sxau',
    name: 'gold',
    symbol: 'xGOLD',
    isCoingeckoSql: true,
    isContractUpdate: true
  },
  {
    type: 'Equities',
    coingecko: 'coinbase-stock',
    name: 'coinbase',
    symbol: 'xCOINBASE',
    isCoingeckoSql: true,
    isContractUpdate: true
  },
  {
    type: 'Commodities',
    coingecko: 'sxag',
    name: 'silver',
    symbol: 'xSILVER',
    isCoingeckoSql: true,
    isContractUpdate: true
  },
  {
    type: 'Crypto',
    coingecko: 'cardano',
    name: 'ada',
    symbol: 'xADA',
    address: '0x5e66a1775BbC249b5D51C13d29245522582E671C'
  },
  {
    type: 'Crypto',
    coingecko: 'binancecoin',
    name: 'bnb',
    symbol: 'xBNB',
    address: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526'
  },
  {
    type: 'Crypto',
    coingecko: 'dogecoin',
    name: 'doge',
    symbol: 'xDOGE',
    address: '0x963D5e7f285Cc84ed566C486c3c1bC911291be38'
  },
  {
    type: 'Crypto',
    coingecko: 'polkadot',
    name: 'dot',
    symbol: 'xDOT',
    address: '0xEA8731FD0685DB8AeAde9EcAE90C4fdf1d8164ed'
  },
  {
    type: 'Crypto',
    coingecko: 'chainlink',
    name: 'link',
    symbol: 'xLINK',
    address: '0x1B329402Cb1825C6F30A0d92aB9E2862BE47333f'
  },
  {
    type: 'Crypto',
    coingecko: 'litecoin',
    name: 'ltc',
    symbol: 'xLTC',
    address: '0x9Dcf949BCA2F4A8a62350E0065d18902eE87Dca3'
  },
  {
    coingecko: 'xrp',
    name: 'xrp',
    symbol: 'xXRP',
    address: '0x4046332373C24Aed1dC8bAd489A04E187833B28d'
  },
  {
    type: 'Crypto',
    coingecko: 'floatprotocol',
    name: 'bank',
    symbol: 'xBANK',
    address: '0xbe75E0725922D78769e3abF0bcb560d1E2675d5d'
  },
  {
    type: 'Crypto',
    coingecko: 'pancakeswap',
    name: 'cake',
    symbol: 'xCAKE',
    address: '0x81faeDDfeBc2F8Ac524327d70Cf913001732224C'
  },
  {
    type: 'Crypto',
    coingecko: 'swipe',
    name: 'sxp',
    symbol: 'xSXP',
    address: '0x678AC35ACbcE272651874E782DB5343F9B8a7D66'
  },
  {
    type: 'Crypto',
    coingecko: 'venus',
    name: 'xvs',
    symbol: 'xXVS',
    address: '0xCfA786C17d6739CBC702693F23cA4417B5945491'
  }
];