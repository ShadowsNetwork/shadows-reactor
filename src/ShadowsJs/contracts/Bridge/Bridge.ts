import { AbstractContractCaller } from '@/ShadowsJs/AbstractContractCaller'
import { Contract } from 'ethers'
import BigNumber from 'bignumber.js'

class Bridge extends AbstractContractCaller {

  constructor(signer: any, provider: any) {
    super()
    this.signer = signer
    this.provider = provider
  }

  async allowance(token, owner, spender) {
    return await new Contract(token, require('./abi/eth-erc20.json'), this.signer || this.provider).allowance(owner, spender)
  }

  async balanceOf(token, account) {
    return await new Contract(token, require('./abi/eth-erc20.json'), this.signer || this.provider).balanceOf(account)
  }

  async approve(token, spender) {
    return await new Contract(token, require('./abi/eth-erc20.json'), this.signer || this.provider)
      .approve(
        spender,
        new BigNumber('2').pow(256)
          .minus(1)
          .toString(10)
      )
  }

  async lock({ lockContractAddress, fromAsset, toChainId, toAddress, amount, fee }) {
    const contract = new Contract(lockContractAddress, require('./abi/eth-lock.json'), this.signer || this.provider)
    return await contract.lock(fromAsset, toChainId, toAddress, amount, fee, 0)

  }

}

export default Bridge
