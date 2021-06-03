import { AbstractContractCaller } from '@/ShadowsJs/AbstractContractCaller'
import { Contract } from 'ethers'
import { getContractConfig } from '@/ShadowsJs/contracts/utils'

class Synth extends AbstractContractCaller {

  constructor(network: string, signer: any, provider: any) {
    super()
    this.signer = signer
    this.provider = provider
    this.network = network
  }

  async balanceOf(currencyKey: string, account: string) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const json = getContractConfig(this.network, currencyKey)

    const contract = new Contract(
      json.address,
      json.abi,
      this.signer || this.provider
    )

    return await contract.balanceOf(account)
  }

}

export default Synth
