/* eslint-disable no-param-reassign */
import { Contract } from 'ethers'
import { getSource, getTarget } from '@/ShadowsJs/contracts/utils'

const { address } = getTarget('bsctestnet', 'ShadowsState')

const { abi } = getSource('bsctestnet', 'ShadowsState')

function Shadows({ signer, provider }) {
  this.contract = new Contract(
    address,
    abi,
    signer || provider,
  )

  this.issuanceRatio = async () => {
    return await this.contract.issuanceRatio()
  }
}

export default Shadows
