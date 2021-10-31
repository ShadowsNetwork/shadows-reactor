import { Contract } from 'ethers'
import { getContractConfig } from '@/ShadowsJs/contracts/utils'
import { AbstractContractCaller } from '@/ShadowsJs/AbstractContractCaller'
import { toByte32 } from '@/web3/utils'

class Oracle extends AbstractContractCaller {

  constructor(network: string, signer: any, provider: any) {
    super()
    this.signer = signer
    this.provider = provider
    this.network = network

    if (!network) {
      return
    }

    const { abi, address } = getContractConfig(this.network, 'Oracle')

    if (!abi || !address) {
      return
    }

    this.contract = new Contract(
      address,
      abi,
      signer || provider
    )
  }

  async rateForCurrency(currencyKey: string) {
    return await this.contract!.rateForCurrency(toByte32(currencyKey))
  }

}

export default Oracle
