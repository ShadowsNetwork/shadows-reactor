import * as ethers from 'ethers'
import Util from './utils/index'
import * as BinaryOptionsUtils from './utils/binaryOptions'
import ContractSettings from './ContractSettings'

class ShadowsJsBase {
  contractSettings: any
  network: any
  util: any
  utils: any
  binaryOptionsUtils: any
  ethers: any
  SUPPORTED_NETWORKS: any

  constructor(contractSettings?: ContractSettings) {
    if (!contractSettings) {
      return
    }

    this.contractSettings = contractSettings
    const { network } = contractSettings
    this.network = network

    this.util = new Util(contractSettings)
    this.utils = this.util
    this.binaryOptionsUtils = BinaryOptionsUtils
    this.ethers = ethers
    this.SUPPORTED_NETWORKS = ContractSettings.SUPPORTED_NETWORKS
  }
}

export default ShadowsJsBase
