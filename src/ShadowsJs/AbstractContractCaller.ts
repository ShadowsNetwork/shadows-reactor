import { Provider } from '@ethersproject/providers'
import { Signer } from '@ethersproject/abstract-signer'
import { Contract } from 'ethers'
import { JsonFragment } from '@ethersproject/abi'

export class AbstractContractCaller {
  protected signer?: Signer
  protected provider?: Provider

  protected abi?: Array<JsonFragment>

  protected network!: string

  protected contract?: Contract
}
