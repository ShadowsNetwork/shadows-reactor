import { Contract } from 'ethers'
import { getContractConfig } from '@/ShadowsJs/contracts/utils'
import { AbstractContractCaller } from '@/ShadowsJs/AbstractContractCaller'

class Exchanger extends AbstractContractCaller {

  constructor(network: string, signer: any, provider: any) {
    super()
    this.signer = signer
    this.provider = provider
    this.network = network

    if (!network) {
      return
    }

    const { abi, address } = getContractConfig(this.network, 'Exchanger')

    this.contract = new Contract(
      address,
      abi,
      signer || provider
    )
  }

}

export default Exchanger
