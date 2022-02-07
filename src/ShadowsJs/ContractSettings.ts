import { getDefaultProvider } from 'ethers'
import { SUPPORTED_ETHEREUM_CHAINS } from '../web3/network'

class ContractSettings {
  networkId: any
  network?: string
  provider: any
  signer: any
  static SUPPORTED_NETWORKS

  /**
   * @constructor
   * @param provider {Object} - ethers.js provider object - default ethers.providers.getDefaultProvider()
   * @param signer {Object} - one of 4 provided signers or a custom ethers.js compatible signer. Use Metamask for Dapp browser support
   * @param networkId {Number} - default 1 - mainnet, also supports 42 (Kovan)
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(provider, signer, networkId) {
    this.networkId = networkId
    this.network = SUPPORTED_ETHEREUM_CHAINS[this.networkId]?.key
    this.provider = provider || getDefaultProvider()
    if (!this.provider && networkId) {
      this.provider = getDefaultProvider(this.network)
    }
    this.signer = signer
  }
}

export default ContractSettings
