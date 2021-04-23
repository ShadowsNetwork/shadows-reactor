import { providers } from 'ethers'
import { BscConnector, NoBscProviderError } from '@binance-chain/bsc-connector'

export const BscWeb3Provider: any = async () => new Promise((resolve, reject) => {
  const bscConnector = new BscConnector({
    supportedChainIds: [
      parseInt(process.env.CHAIN_ID!, 16)
    ]
  })
  bscConnector.getProvider()
    .then(provider => {
      if (!provider) {
        setTimeout(async () => {
          provider = await bscConnector.getProvider()
          if (provider) {
            resolve(new providers.Web3Provider(provider))
          } else {
            reject(new NoBscProviderError())
          }
        }, 1500)
      } else {
        resolve(new providers.Web3Provider(provider))
      }
    })
})
