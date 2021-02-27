/* eslint-disable no-param-reassign */
import { Contract } from 'ethers'
import { getSource, getSynths, getTarget } from '@/ShadowsJs/contracts/utils'

const synths = getSynths({ network: 'kovan' })

function getAddress(currencyName) {
  return getTarget('kovan', `Synth${currencyName}`).address
}

const { abi } = getSource('kovan', 'Synth')

class SynthImplementation {
  constructor(props) {
    const { signer, provider, address } = props

    this.contract = new Contract(
      address,
      abi,
      signer || provider,
    )

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns Number
     * */
    this.DECIMALS = async () => {
      return await this.contract.DECIMALS()
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns String<EthAddress>
     * */
    this.FEE_ADDRESS = async () => {
      return await this.contract.FEE_ADDRESS()
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param txParams

     * */
    this.acceptOwnership = async txParams => {
      // eslint-disable-next-line no-param-reassign
      txParams = txParams || {}
      return await this.contract.acceptOwnership(txParams)
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @param owner
     * @param spender
     * @returns BigNumber
     * */
    this.allowance = async (owner, spender) => {
      return await this.contract.allowance(owner, spender)
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param spender
     * @param value {BigNumber}
     * @param txParams
     * @returns boolean
     * */
    this.approve = async (spender, value, txParams) => {
      txParams = txParams || {}
      return await this.contract.approve(spender, value, txParams)
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @param account
     * @returns BigNumber
     * */
    this.balanceOf = async account => {
      return await this.contract.balanceOf(account)
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param account
     * @param amount {BigNumber}
     * @param txParams

     * */
    this.burn = async (account, amount, txParams) => {
      txParams = txParams || {}
      return await this.contract.burn(account, amount, txParams)
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns bytes32
     * */
    this.currencyKey = async () => {
      return await this.contract.currencyKey()
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns Number
     * */
    this.decimals = async () => {
      return await this.contract.decimals()
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns String<EthAddress>
     * */
    this.integrationProxy = async () => {
      return await this.contract.integrationProxy()
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns boolean
     * */
    this.isResolverCached = async () => {
      return await this.contract.isResolverCached()
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param account
     * @param amount {BigNumber}
     * @param txParams

     * */
    this.issue = async (account, amount, txParams) => {
      txParams = txParams || {}
      return await this.contract.issue(account, amount, txParams)
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns String<EthAddress>
     * */
    this.messageSender = async () => {
      return await this.contract.messageSender()
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns String
     * */
    this.name = async () => {
      return await this.contract.name()
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param _owner
     * @param txParams

     * */
    this.nominateNewOwner = async (_owner, txParams) => {
      txParams = txParams || {}
      return await this.contract.nominateNewOwner(_owner, txParams)
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns String<EthAddress>
     * */
    this.nominatedOwner = async () => {
      return await this.contract.nominatedOwner()
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns String<EthAddress>
     * */
    this.owner = async () => {
      return await this.contract.owner()
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns String<EthAddress>
     * */
    this.proxy = async () => {
      return await this.contract.proxy()
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param txParams

     * */
    this.rebuildCache = async txParams => {
      txParams = txParams || {}
      return await this.contract.rebuildCache(txParams)
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns String<EthAddress>
     * */
    this.resolver = async () => {
      return await this.contract.resolver()
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns bytes32[]
     * */
    this.resolverAddressesRequired = async () => {
      return await this.contract.resolverAddressesRequired()
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param _integrationProxy
     * @param txParams

     * */
    this.setIntegrationProxy = async (_integrationProxy, txParams) => {
      txParams = txParams || {}
      return await this.contract.setIntegrationProxy(_integrationProxy, txParams)
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param sender
     * @param txParams

     * */
    this.setMessageSender = async (sender, txParams) => {
      txParams = txParams || {}
      return await this.contract.setMessageSender(sender, txParams)
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param _proxy
     * @param txParams

     * */
    this.setProxy = async (_proxy, txParams) => {
      txParams = txParams || {}
      return await this.contract.setProxy(_proxy, txParams)
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param _tokenState
     * @param txParams

     * */
    this.setTokenState = async (_tokenState, txParams) => {
      txParams = txParams || {}
      return await this.contract.setTokenState(_tokenState, txParams)
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param amount {BigNumber}
     * @param txParams

     * */
    this.setTotalSupply = async (amount, txParams) => {
      txParams = txParams || {}
      return await this.contract.setTotalSupply(amount, txParams)
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns String
     * */
    this.symbol = async () => {
      return await this.contract.symbol()
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns String<EthAddress>
     * */
    this.tokenState = async () => {
      return await this.contract.tokenState()
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @returns BigNumber
     * */
    this.totalSupply = async () => {
      return await this.contract.totalSupply()
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param to
     * @param value {BigNumber}
     * @param txParams
     * @returns boolean
     * */
    this.transfer = async (to, value, txParams) => {
      txParams = txParams || {}
      return await this.contract.transfer(to, value, txParams)
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param to
     * @param value {BigNumber}
     * @param txParams
     * @returns boolean
     * */
    this.transferAndSettle = async (to, value, txParams) => {
      txParams = txParams || {}
      return await this.contract.transferAndSettle(to, value, txParams)
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param from
     * @param to
     * @param value {BigNumber}
     * @param txParams
     * @returns boolean
     * */
    this.transferFrom = async (from, to, value, txParams) => {
      txParams = txParams || {}
      return await this.contract.transferFrom(from, to, value, txParams)
    }

    /**
     * Transaction (consumes gas, requires signer)
     * @param from
     * @param to
     * @param value {BigNumber}
     * @param txParams
     * @returns boolean
     * */
    this.transferFromAndSettle = async (from, to, value, txParams) => {
      txParams = txParams || {}
      return await this.contract.transferFromAndSettle(from, to, value, txParams)
    }

    /**
     * Call (no gas consumed, doesn't require signer)
     * @param account
     * @returns BigNumber
     * */
    this.transferableSynths = async account => {
      return await this.contract.transferableSynths(account)
    }
  }
}

function Synth({ signer, provider }) {
  synths.forEach(synth => {
    this[synth.name] = new SynthImplementation(
      { signer, provider, address: getAddress(synth.name) },
    )
  })
}

export default Synth
