import * as ethers from 'ethers'
import contracts from './contracts'
import Util from './utils/index'
import * as BinaryOptionsUtils from './utils/binaryOptions'
import ContractSettings from './contractSettings'

class ShadowsJsBase {
  constructor(contractSettings, signers) {
    // prevent warnings about "Multiple definitions" for transfer* function from Synth contract
    // ethers.errors.setLogLevel('error')
    this.contractSettings = new ContractSettings(contractSettings)
    const { network } = this.contractSettings
    this.signers = signers
    this.network = network
    const contractForEnv = contracts[network]
    Object.keys(contractForEnv)
      .forEach(name => {
        const Contract = contractForEnv[name]
        this[name] = new Contract(contractSettings)
      })
    this.util = new Util(contractSettings)
    this.utils = this.util
    this.binaryOptionsUtils = BinaryOptionsUtils
    this.ethers = ethers
    this.SUPPORTED_NETWORKS = ContractSettings.SUPPORTED_NETWORKS
  }
}

export default ShadowsJsBase
