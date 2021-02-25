import { utils } from 'ethers'

import ShadowsJsBase from '@/ShadowsJs/ShadowsJsBase'
import Metamask from './signers/metamaskSigner'
import PrivateKey from './signers/privateKeySigner'

const signers = {
  Metamask,
  PrivateKey,
}

export default class ShadowsJS extends ShadowsJsBase {
  /**
   * Creates instances of Synthetix contracts based on ContractSettings.
   * Usage example:
   * const { ShadowsJS } = require('ShadowsJS');
   * const dowJS = new ShadowsJS();  //uses default ContractSettings - ethers.js default provider, mainnet
   * @constructor
   * @param contractSettings {ContractSettings}
   */
  constructor({ provider, signer, networkId }) {
    super({ provider, signer, networkId }, signers)
  }
}

ShadowsJS.signers = signers
ShadowsJS.utils = utils // shortcut to ethers utils without having to create instance
