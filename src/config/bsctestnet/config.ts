import { ShadowsSynth } from '../shadowssynths.config';

const shadowsSynthsConfig: Array<ShadowsSynth> = [
  {
    type: 'Cryptos',
    name: 'dows',
    coingecko: 'shadows',
    symbol: "DOWS",
    isContractUpdate: true
  },
  {
    type: 'Cryptos',
    coingecko: 'ethereum',
    name: "eth",
    symbol: "ShaETH",
    address: '0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7'
  },
  {
    type: 'Cryptos',
    coingecko: 'bitcoin',
    name: "btc",
    symbol: "xBTC",
    address: '0x5741306c21795FdCBb9b265Ea0255F499DFe515C'
  },
  {
    type: 'Commodities',
    coingecko: 'sxau',
    name: "gold",
    symbol: "ShaGOLD",
    address: '',
  },
  {
    type: 'Equaties',
    coingecko: 'coinbase-stock',
    name: "coinbase",
    symbol: "ShaCOINBASE",
    address: '',
  },
  {
    type: 'Commodities',
    coingecko: 'sxag',
    name: "silver",
    symbol: "ShaSILVER",
    address: '',
  },
  {
    type: 'Cryptos',
    coingecko: 'cardano',
    name: "ada",
    symbol: "ShaADA",
    address: '0x5e66a1775BbC249b5D51C13d29245522582E671C'
  },
  {
    type: 'Cryptos',
    coingecko: 'binancecoin',
    name: "bnb",
    symbol: "ShaBNB",
    address: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526'
  },
  {
    type: 'Cryptos',
    coingecko: 'dogecoin',
    name: "doge",
    symbol: "ShaDOGE",
    address: '0x963D5e7f285Cc84ed566C486c3c1bC911291be38'
  },
  {
    type: 'Cryptos',
    coingecko: 'polkadot',
    name: "dot",
    symbol: "ShaDOT",
    address: '0xEA8731FD0685DB8AeAde9EcAE90C4fdf1d8164ed'
  },
  {
    type: 'Cryptos',
    coingecko: 'chainlink',
    name: "link",
    symbol: "ShaLINK",
    address: '0x1B329402Cb1825C6F30A0d92aB9E2862BE47333f'
  },
  {
    type: 'Cryptos',
    coingecko: 'litecoin',
    name: "ltc",
    symbol: "ShaLTC",
    address: '0x9Dcf949BCA2F4A8a62350E0065d18902eE87Dca3'
  },
  {
    coingecko: 'xrp',
    name: "xrp",
    symbol: "ShaXRP",
    address: '0x4046332373C24Aed1dC8bAd489A04E187833B28d'
  },
  {
    type: 'Cryptos',
    coingecko: 'floatprotocol',
    name: "bank",
    symbol: "ShaBANK",
    address: '0xbe75E0725922D78769e3abF0bcb560d1E2675d5d'
  },
  {
    type: 'Cryptos',
    coingecko: 'pancakeswap',
    name: "cake",
    symbol: "ShaCAKE",
    address: '0x81faeDDfeBc2F8Ac524327d70Cf913001732224C'
  },
  {
    type: 'Cryptos',
    coingecko: 'swipe',
    name: "sxp",
    symbol: "ShaSXP",
    address: '0x678AC35ACbcE272651874E782DB5343F9B8a7D66'
  },
  {
    type: 'Cryptos',
    coingecko: 'venus',
    name: "xvs",
    symbol: "ShaXVS",
    address: '0xCfA786C17d6739CBC702693F23cA4417B5945491'
  }
];

export default shadowsSynthsConfig;