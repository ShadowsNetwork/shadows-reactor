import { getDefaultProvider } from 'ethers'
import { SUPPORTED_NETWORKS } from './networkHelper'

class ContractSettings {
  networkId: any
  network: any
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
    this.network = SUPPORTED_NETWORKS[Number(this.networkId)]
    this.provider = provider || getDefaultProvider()
    if (!this.provider && networkId) {
      this.provider = getDefaultProvider(this.network)
    }
    this.signer = signer
  }
}

ContractSettings.SUPPORTED_NETWORKS = SUPPORTED_NETWORKS

export default ContractSettings
