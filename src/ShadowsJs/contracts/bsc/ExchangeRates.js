/* eslint-disable no-param-reassign */
import { Contract } from 'ethers'
import { getSource, getTarget } from '@/ShadowsJs/contracts/utils'

const { address } = getTarget('bsctestnet', 'ExchangeRates')

const { abi } = getSource('bsctestnet', 'ExchangeRates')

function Shadows({ signer, provider }) {
  this.contract = new Contract(
    address,
    abi,
    signer || provider,
  )

  this.rateForCurrency = async currencyKey => {
    return await this.contract.rateForCurrency(currencyKey)
  }
}

export default Shadows
