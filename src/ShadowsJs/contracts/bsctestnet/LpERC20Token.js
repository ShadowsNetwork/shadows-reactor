/* eslint-disable no-param-reassign */
import { Contract } from 'ethers'
import { getSource, getTarget } from '@/ShadowsJs/contracts/utils'

const { address } = getTarget('bsctestnet', 'LpERC20Token')

const { abi } = getSource('bsctestnet', 'ERC20')

function LpERC20Token({
  signer,
  provider
}) {
  this.contract = new Contract(
    address,
    abi,
    signer || provider
  )

  this.balanceOf = async account => {
    return await this.contract.balanceOf(account)
  }

  this.approve = async (spenderAddress, amount) => {
    return await this.contract.approve(spenderAddress, amount)
  }

  this.totalSupply = async () => {
    return await this.contract.totalSupply()
  }

}

export default LpERC20Token
