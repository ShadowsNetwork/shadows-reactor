/* eslint-disable no-param-reassign */
import { Contract } from 'ethers'
import { getSource, getSynths, getTarget } from '@/ShadowsJs/contracts/utils'

const synths = getSynths({ network: 'bsctestnet' })

function getAddress(currencyName) {
  return getTarget('bsctestnet', `Proxy${currencyName}`).address
}

const { abi } = getSource('bsctestnet', 'ProxyERC20')

class ProxyImplementation {
  constructor(props) {
    const { signer, provider, address } = props

    this.contract = new Contract(
      address,
      abi,
      signer || provider,
    )

    this.transfer = async (to, value) => {
      return await this.contract.transfer(to, value)
    }
  }
}

function ProxyERC20({ signer, provider }) {
  synths.forEach(synth => {
    this[synth.name] = new ProxyImplementation(
      { signer, provider, address: getAddress(synth.name) },
    )
  })
}

export default ProxyERC20
