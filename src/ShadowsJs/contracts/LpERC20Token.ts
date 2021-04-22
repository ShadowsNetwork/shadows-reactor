import { Contract } from 'ethers'
import { getSource } from '@/ShadowsJs/contracts/utils'
import { AbstractContractCaller } from '@/ShadowsJs/AbstractContractCaller'
import BigNumber from 'bignumber.js'

class LpERC20Token extends AbstractContractCaller {

  constructor(network: string, signer: any, provider: any) {
    super()
    this.signer = signer
    this.provider = provider
    this.network = network

    if (!network) {
      return
    }

    this.abi = getSource(this.network, 'ERC20').abi
  }

  async balanceOf(lpTokenAddress: string, account: string) {
    return await new Contract(lpTokenAddress, this.abi, this.signer || this.provider)
      .balanceOf(account)
  }

  async approve(lpTokenAddress: string, farmAddress: string) {
    return await new Contract(lpTokenAddress, this.abi, this.signer || this.provider)
      .approve(
        farmAddress,
        new BigNumber('2').pow(256)
          .minus(1)
          .toString(10)
      )
  }

  async allowance(lpTokenAddress: string, owner: string, farmAddress: string) {
    return await new Contract(lpTokenAddress, this.abi, this.signer || this.provider)
      .allowance(owner, farmAddress)
  }

  async totalSupply(lpTokenAddress: string) {
    return await new Contract(lpTokenAddress, this.abi, this.signer || this.provider)
      .totalSupply()
  }

}

export default LpERC20Token
