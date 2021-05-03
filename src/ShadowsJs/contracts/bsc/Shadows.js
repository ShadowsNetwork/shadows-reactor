/* eslint-disable no-param-reassign */
import { Contract } from 'ethers'
import { getSource, getTarget } from '@/ShadowsJs/contracts/utils'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'

const { address } = getTarget('bsctestnet', 'Shadows')

const { abi } = getSource('bsctestnet', 'Shadows')

function Shadows({
  signer,
  provider
}) {
  this.contract = new Contract(
    address,
    abi,
    signer || provider
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
    try {
      return await this.contract.burnSynths(amount)
    } catch (e) {
      const gasLimit = (await dowsJSConnector.provider.getBlock('latest')).gasLimit
      return await this.contract.burnSynths(amount, {
        gasLimit
      })
    }
  }

  this.exchange = async (sourceCurrencyKey, sourceAmount, destinationCurrencyKey) => {
    try {
      return await this.contract.exchange(sourceCurrencyKey, sourceAmount, destinationCurrencyKey)
    } catch (e) {
      console.error(e)
      return await this.contract.exchange(sourceCurrencyKey, sourceAmount, destinationCurrencyKey, {
        gasLimit: 1000000
      })
    }
  }

  this.availableCurrencyKeys = async () => {
    return await this.contract.availableCurrencyKeys()
  }

  this.maxIssuableSynths = async account => {
    return await this.contract.maxIssuableSynths(account)
  }
}

export default Shadows
