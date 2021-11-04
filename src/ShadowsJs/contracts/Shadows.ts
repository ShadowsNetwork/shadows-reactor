import { Contract } from 'ethers'
import { getContractConfig } from '@/ShadowsJs/contracts/utils'
import { AbstractContractCaller } from '@/ShadowsJs/AbstractContractCaller'

class Shadows extends AbstractContractCaller {

  constructor(network?: string, signer?: any, provider?: any) {
    super()
    this.signer = signer
    this.provider = provider
    this.network = network

    if (!this.network) {
      return
    }

    const { abi, address } = getContractConfig(this.network, 'Shadows')

    if (!abi || !address) {
      return
    }

    this.contract = new Contract(
      address,
      abi,
      signer || provider
    )
  }

  async balanceOf(account) {
    return await this.contract!.balanceOf(account)
  }

  async exchange(sourceCurrencyKey, sourceAmount, destinationCurrencyKey) {
    return await this.contract!.exchange(sourceCurrencyKey, sourceAmount, destinationCurrencyKey)
  }

  async maxIssuableSynths(account) {
    return await this.contract!.maxIssuableSynths(account)
  }
}

export default Shadows
