import { Contract } from 'ethers'
import { getSource } from '@/ShadowsJs/contracts/utils'
import { AbstractContractCaller } from '@/ShadowsJs/AbstractContractCaller'

class Farm extends AbstractContractCaller {

  constructor(network: string, signer: any, provider: any) {
    super()
    this.signer = signer
    this.provider = provider
    this.network = network

    if (!network) {
      return
    }

    this.abi = getSource(this.network, 'Farm')?.abi
  }

  async deposited(farmAddress, pid, account) {
    return await new Contract(farmAddress, this.abi!, this.signer || this.provider).deposited(pid, account)
  }

  async userInfo(farmAddress, pid, account) {
    return await new Contract(farmAddress, this.abi!, this.signer || this.provider).userInfo(pid, account)
  }

  async withdraw(farmAddress, pid, account) {
    return await new Contract(farmAddress, this.abi!, this.signer || this.provider).withdraw(pid, account)
  }

  async deposit(farmAddress, pid, amount) {
    return await new Contract(farmAddress, this.abi!, this.signer || this.provider).deposit(pid, amount)
  }

  async pending(farmAddress, pid, account) {
    return await new Contract(farmAddress, this.abi!, this.signer || this.provider).pending(pid, account)
  }

  async rewardPerBlock(farmAddress) {
    return await new Contract(farmAddress, this.abi!, this.signer || this.provider).rewardPerBlock()
  }

  async multiplier(farmAddress) {
    return await new Contract(farmAddress, this.abi!, this.signer || this.provider).BONUS_MULTIPLIER()
  }

  async poolInfo(farmAddress, pid) {
    return await new Contract(farmAddress, this.abi!, this.signer || this.provider).poolInfo(pid)
  }

  async totalAllocPoint(farmAddress) {
    return await new Contract(farmAddress, this.abi!, this.signer || this.provider).totalAllocPoint()
  }
}

export default Farm
