import { AbstractContractCaller } from '@/ShadowsJs/AbstractContractCaller'
import { Contract } from 'ethers'
import { getContractConfig } from '@/ShadowsJs/contracts/utils'
import BN from 'bn.js'

class Synth extends AbstractContractCaller {

  constructor(network?: string, signer?: any, provider?: any) {
    super()
    this.signer = signer
    this.provider = provider
    this.network = network
  }

  async balanceOf(currencyKey: string, account: string) {
    if (!this.network) {
      return new BN(0)
    }

    const json = getContractConfig(this.network, currencyKey)

    if (!json) {
      return new BN(0)
    }

    const contract = new Contract(
      json.address,
      json.abi,
      this.signer || this.provider
    )

    return await contract.balanceOf(account)
  }

}

export default Synth
