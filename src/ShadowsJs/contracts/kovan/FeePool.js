import { Contract } from 'ethers'
import { getSource, getTarget } from '@/ShadowsJs/contracts/utils'

const { address } = getTarget('kovan', 'FeePool')

const { abi } = getSource('kovan', 'FeePool')

function FeePool({ signer, provider }) {
  this.contract = new Contract(
    address,
    abi,
    signer || provider,
  )

  this.claimFees = async () => {
    return await this.contract.claimFees()
  }

  this.feesAvailable = async account => {
    return await this.contract.feesAvailable(account)
  }
}

export default FeePool
