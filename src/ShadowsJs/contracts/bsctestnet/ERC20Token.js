/* eslint-disable no-param-reassign */
import { Contract } from 'ethers'
import { getSource, getTarget } from '@/ShadowsJs/contracts/utils'

const { address } = getTarget('bsctestnet', 'ERC20Token')

const { abi } = getSource('bsctestnet', 'ERC20')

function ERC20Token({ signer, provider }) {
  this.contract = new Contract(
    address,
    abi,
    signer || provider,
  )

  this.balanceOf = async account => {
    return await this.contract.balanceOf(account)
  }
}

export default ERC20Token
