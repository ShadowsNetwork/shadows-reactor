/* eslint-disable no-param-reassign */
import { Contract } from 'ethers'
import { getSource, getTarget } from '@/ShadowsJs/contracts/utils'

const { address } = getTarget('bsctestnet', 'Farm')

const { abi } = getSource('bsctestnet', 'Farm')

function Farm({
  signer,
  provider
}) {
  this.contract = new Contract(
    address,
    abi,
    signer || provider
  )

  this.contractAddress = () => this.contract.address

  this.deposited = async (pid, account) => {
    return await this.contract.deposited(pid, account)
  }

  this.userInfo = async (pid, account) => {
    return await this.contract.userInfo(pid, account)
  }

  this.withdraw = async (pid, account) => {
    return await this.contract.withdraw(pid, account)
  }

  this.deposit = async (pid, amount) => {
    return await this.contract.deposit(pid, amount)
  }

  this.pending = async (pid, account) => {
    return await this.contract.pending(pid, account)
  }

}

export default Farm
