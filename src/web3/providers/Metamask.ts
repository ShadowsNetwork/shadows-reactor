import { providers } from 'ethers'

export const MetamaskWeb3Provider: any = () => {
  const { ethereum } = window as WindowChain
  if (!ethereum) {
    throw Error('windows.ethereum is undefined')
  }

  return new providers.Web3Provider(ethereum)
}

