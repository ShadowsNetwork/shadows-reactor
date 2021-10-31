import { Contract } from 'ethers'
import { getContractConfig } from '@/ShadowsJs/contracts/utils'
import { AbstractContractCaller } from '@/ShadowsJs/AbstractContractCaller'
import BN from 'bn.js'

class FeePool extends AbstractContractCaller {

  constructor(network: string, signer: any, provider: any) {
    super()
    this.signer = signer
    this.provider = provider
    this.network = network

    if (!network) {
      return
    }

    const { abi, address } = getContractConfig(this.network, 'FeePool')

    if (!abi || !address) {
      return
    }

    this.contract = new Contract(
      address,
      abi,
      signer || provider
    )
  }

  async claimFees() {
    return await this.contract!.claimFees()
  }

  async feesAvailable(account): Promise<[BN, BN]> {
    return await this.contract!.feesAvailable(account)
  }

  async feesByPeriod(account): Promise<Array<[BN, BN]>> {
    return await this.contract!.feesByPeriod(account)
  }
}

export default FeePool
