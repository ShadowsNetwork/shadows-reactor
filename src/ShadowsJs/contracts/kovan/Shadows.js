/* eslint-disable no-param-reassign */
import { Contract } from 'ethers'
import { getSource, getTarget } from '@/ShadowsJs/contracts/utils'

const { address } = getTarget('kovan', 'Shadows')

const { abi } = getSource('kovan', 'Shadows')

function Shadows({ signer, provider }) {
  this.contract = new Contract(
    address,
    abi,
    signer || provider,
  )

  this.collateralisationRatio = async account => {
    return await this.contract.collateralisationRatio(account)
  }

  this.balanceOf = async account => {
    return await this.contract.balanceOf(account)
  }

  this.transferableShadows = async account => {
    return await this.contract.transferableShadows(account)
  }

  this.debtBalanceOf = async (account, currencyKey) => {
    return await this.contract.debtBalanceOf(account, currencyKey)
  }

  this.issueSynths = async amount => {
    return await this.contract.issueSynths(amount)
  }

  this.issueMaxSynths = async () => {
    return await this.contract.issueMaxSynths()
  }

  this.remainingIssuableSynths = async account => {
    return await this.contract.remainingIssuableSynths(account)
  }

  this.burnSynths = async amount => {
    return await this.contract.burnSynths(amount)
  }

  this.exchange = async (sourceCurrencyKey, sourceAmount, destinationCurrencyKey) => {
    return await this.contract.exchange(sourceCurrencyKey, sourceAmount, destinationCurrencyKey)
  }

  this.availableCurrencyKeys = async () => {
    return await this.contract.availableCurrencyKeys()
  }

  this.maxIssuableSynths = async account => {
    return await this.contract.maxIssuableSynths(account)
  }
}

export default Shadows
