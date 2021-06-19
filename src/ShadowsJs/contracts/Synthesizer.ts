import { Contract } from 'ethers'
import { getContractConfig } from '@/ShadowsJs/contracts/utils'
import { AbstractContractCaller } from '@/ShadowsJs/AbstractContractCaller'
import BN from 'bn.js'

class Synthesizer extends AbstractContractCaller {

  constructor(network: string, signer: any, provider: any) {
    super()
    this.signer = signer
    this.provider = provider
    this.network = network

    if (!network) {
      return
    }

    // const { abi, address } = getContractConfig(this.network, 'Synthesizer_Proxy')
    const { abi, address } = getContractConfig(this.network, 'Synthesizer')

    this.contract = new Contract(
      address,
      abi,
      signer || provider
    )
    console.log(22222222)
  }

  async issuanceRatio() {
    return await this.contract!.issuanceRatio()
  }

  async collateralisationRatio(account): Promise<BN> {
    return await this.contract!.collateralisationRatio(account)
  }

  async transferableShadows(account) {
    return await this.contract!.transferableShadows(account)
  }

  async remainingIssuableSynths(account) {
    return await this.contract!.remainingIssuableSynths(account)
  }

  async availableCurrencyKeys() {
    return await this.contract!.availableCurrencyKeys()
  }

  async debtBalanceOf(account, currencyKey) {
    return await this.contract!.debtBalanceOf(account, currencyKey)
  }

  async issueSynths(amount) {
    return await this.contract!.issueSynths(amount)
  }

  async issueMaxSynths() {
    return await this.contract!.issueMaxSynths()
  }

  async burnSynths(amount) {
    return await this.contract!.burnSynths(amount)
  }

  async exchange(sourceCurrencyKey: string, sourceAmount, destinationCurrencyKey: string) {
    return await this.contract!.exchange(sourceCurrencyKey, sourceAmount, destinationCurrencyKey)
  }

}

export default Synthesizer
