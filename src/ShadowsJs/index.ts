import { utils } from 'ethers'

import ShadowsJsBase from '@/ShadowsJs/ShadowsJsBase'
import ContractSettings from '@/ShadowsJs/ContractSettings'
import LpERC20Token from '@/ShadowsJs/contracts/LpERC20Token'
import Farm from '@/ShadowsJs/contracts/Farm'
import Bridge from './contracts/Bridge/Bridge'
import Shadows from '@/ShadowsJs/contracts/Shadows'
import Synthesizer from '@/ShadowsJs/contracts/Synthesizer'
import FeePool from '@/ShadowsJs/contracts/FeePool'
import Oracle from './contracts/Oracle'
import Synth from '@/ShadowsJs/contracts/Synth'
import Exchanger from './contracts/Exchanger'

export default class ShadowsJS extends ShadowsJsBase {
  static signers
  static utils

  LpERC20Token: LpERC20Token
  Farm: Farm
  Bridge: Bridge
  Shadows: Shadows
  Synthesizer: Synthesizer
  FeePool: FeePool
  Oracle: Oracle
  Synth: Synth
  Exchanger: Exchanger

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
    this.Shadows = new Shadows(network, signer, provider)
    this.Synthesizer = new Synthesizer(network, signer, provider)
    this.FeePool = new FeePool(network, signer, provider)
    this.Oracle = new Oracle(network, signer, provider)
    this.Synth = new Synth(network, signer, provider)
    this.Exchanger = new Exchanger(network, signer, provider)

  }

}

ShadowsJS.utils = utils // shortcut to ethers utils without having to create instance
