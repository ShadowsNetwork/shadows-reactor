import { utils } from 'ethers'

import ShadowsJsBase from '@/ShadowsJs/ShadowsJsBase'
import ContractSettings from '@/ShadowsJs/ContractSettings'
import LpERC20Token from '@/ShadowsJs/contracts/LpERC20Token'
import Farm from '@/ShadowsJs/contracts/Farm'
import Bridge from './contracts/Bridge/Bridge'

export default class ShadowsJS extends ShadowsJsBase {
  static signers
  static utils

  LpERC20Token: LpERC20Token
  Farm: Farm
  Bridge: Bridge

  /**
   * Creates instances of Shadows contracts based on ContractSettings.
   * @constructor
   * @param contractSettings {ContractSettings}
   */
  constructor(contractSettings?: ContractSettings) {
    super(contractSettings)

    const network = contractSettings?.network
    const signer = contractSettings?.signer
    const provider = contractSettings?.provider

    this.LpERC20Token = new LpERC20Token(network, signer, provider)
    this.Farm = new Farm(network, signer, provider)
    this.Bridge = new Bridge(signer, provider)
  }

}

ShadowsJS.utils = utils // shortcut to ethers utils without having to create instance
