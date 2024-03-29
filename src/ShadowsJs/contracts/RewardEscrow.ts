import { Contract } from 'ethers'
import { getContractConfig } from '@/ShadowsJs/contracts/utils'
import { AbstractContractCaller } from '@/ShadowsJs/AbstractContractCaller'

class RewardEscrow extends AbstractContractCaller {

  constructor(network?: string, signer?: any, provider?: any) {
    super()
    this.signer = signer
    this.provider = provider
    this.network = network

    if (!this.network) {
      return
    }

    const { abi, address } = getContractConfig(this.network, 'RewardEscrow')

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
    return this.contract!.balanceOf(account)
  }

  async vestBalanceOf(account) {
    return this.contract!.vestBalanceOf(account)
  }
  async vest() {
    return this.contract!.vest()
  }

  async getNextVestingTime(account){
    return this.contract!.getNextVestingTime(account)
  }

  async getNextVestingQuantity(account){
    return this.contract!.getNextVestingQuantity(account)
  }
  async vestingScheduleTime(){
    return this.contract!.vestingScheduleTime()
  }
}

export default RewardEscrow
