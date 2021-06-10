import { Contract } from 'ethers'
import { getContractConfig } from '@/ShadowsJs/contracts/utils'
import { AbstractContractCaller } from '@/ShadowsJs/AbstractContractCaller'

class RewardEscrow extends AbstractContractCaller {

  constructor(network: string, signer: any, provider: any) {
    super()
    this.signer = signer
    this.provider = provider
    this.network = network

    if (!network) {
      return
    }

    const { abi, address } = getContractConfig(this.network, 'RewardEscrow')

    this.contract = new Contract(
      address,
      abi,
      signer || provider
    )
  }

  async balanceOf(account) {
    return this.contract!.balanceOf(account)
  }

  async vestBalanceOf(account) {
    return this.contract!.vestBalanceOf(account)
  }
  async vest() {
    return this.contract!.vest()
  }
}

export default RewardEscrow
