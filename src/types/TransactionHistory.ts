/* eslint-disable no-unused-vars */
import { PolyTransactionStatus } from '@/types/PolyTransactionStatus'
import { getPolyChainByChainName, getPolyChainById } from '@/utils/bridgeUtils'
import { PolyChain } from '@/types/PolyChain'
import { ConfigType } from '../../config'
import { notifyTransactionFailed, notifyTransactionSuccess } from '@/utils/TransactionNotifycation'

const config = process.env.CONTRACT_CONFIG as unknown as ConfigType

export enum TransactionStatus {
  /**
   * Transaction is initialized, and waiting user to confirm in Wallet.
   */
  WaitForConfirmation,

  /**
   * User rejects to sign the transaction.
   */
  SignatureError,

  /**
   * Transaction has been sent to the chain, and waiting to be confirmed on chain.
   */
  Submitted,

  /**
   * Transaction has been confirmed on chain.
   */
  Completed,

  /**
   * Something wrong happened on the chain, and leaded transaction failed.
   */
  Failed,

}

export const TransactionHistoryImplementationClassType = {
  RedeemXUSD: 'RedeemXUSD',
  RedeemDOWS: 'RedeemDOWS',
  LockLP: 'LockLP',
  UnlockLP: 'UnlockLP',
  Bridge: 'Bridge',
  Approve: 'Approve',
  Mint: 'Mint',
  Burn: 'Burn',
  Trade: 'Trade'
}

export abstract class TransactionHistory {
  private _status: TransactionStatus
  hash: string

  protected constructor(hash: string, status?: TransactionStatus) {
    this.hash = hash
    this._status = status !== undefined ? status : TransactionStatus.Submitted
  }

  get status(): TransactionStatus {
    return this._status
  }

  submit(): void {
    this._status = TransactionStatus.Submitted
  }

  reject(): void {
    this._status = TransactionStatus.SignatureError
  }

  complete(): void {
    if (this._status !== TransactionStatus.Completed) {
      notifyTransactionSuccess(this)
    }

    this._status = TransactionStatus.Completed
  }

  fail(): void {
    if (this._status !== TransactionStatus.Failed) {
      notifyTransactionFailed(this)
    }

    this._status = TransactionStatus.Failed
  }

  abstract TYPE

  abstract toString(): string

  abstract get url(): string

  static fromJson(_json: unknown): any {
    throw new Error('Not implementation')
  }
}

export class RedeemDOWS extends TransactionHistory {
  constructor(hash: string, public amount: string, status?: TransactionStatus) {
    super(hash, status)
  }

  TYPE = TransactionHistoryImplementationClassType.RedeemDOWS

  toString(): string {
    return `Redeem ${this.amount} DOWS`
  }

  get url(): string {
    return `${process.env.BLOCK_EXPLORER_URL}/tx/${this.hash}`
  }

}

export class RedeemXUSD extends TransactionHistory {
  constructor(hash: string, public amount: string, status?: TransactionStatus) {
    super(hash, status)
  }

  TYPE = TransactionHistoryImplementationClassType.RedeemXUSD

  toString(): string {
    return `Redeem ${this.amount} ShaUSD`
  }

  get url(): string {
    return `${process.env.BLOCK_EXPLORER_URL}/tx/${this.hash}`
  }

}

export class LockLPToken extends TransactionHistory {
  constructor(hash: string, public amount: string, status?: TransactionStatus) {
    super(hash, status)
  }

  TYPE = TransactionHistoryImplementationClassType.LockLP

  toString(): string {
    return `Lock ${this.amount} LP Tokens`
  }

  get url(): string {
    return `${process.env.BLOCK_EXPLORER_URL}/tx/${this.hash}`
  }
}

export class UnlockLPToken extends TransactionHistory {
  constructor(hash: string, public amount: string, status?: TransactionStatus) {
    super(hash, status)
  }

  TYPE = TransactionHistoryImplementationClassType.UnlockLP

  toString(): string {
    return `Unlock ${this.amount} LP Tokens`
  }

  get url(): string {
    return `${process.env.BLOCK_EXPLORER_URL}/tx/${this.hash}`
  }
}

export class BridgeDows extends TransactionHistory {
  public state?: number
  public lastTransactionHash?: string
  public lastTransactionPolyChainId?: number

  constructor(
    hash: string,
    public amount: string,
    public fromChainName: string,
    public toChainName: string,
    status?: TransactionStatus
  ) {
    super(hash, status)
  }

  TYPE = TransactionHistoryImplementationClassType.Bridge

  toString(): string {
    return `Bridge ${this.amount} DOWS from ${this.fromChainName} to ${this.toChainName}`
  }

  get url(): string {
    if (!this.lastTransactionHash) {
      const polyChain: PolyChain = getPolyChainByChainName(this.fromChainName)!
      return `${polyChain.explorerUrl}/tx/${this.hash}`
    }

    // PolyChainId === 0  =>  PolyChain
    if (this.lastTransactionPolyChainId === 0) {
      return `${config.bridge.polyChainExplorerUrl}/tx/${this.lastTransactionHash}`
    }

    const polyChain: PolyChain = getPolyChainById(this.lastTransactionPolyChainId!)!
    return `${polyChain.explorerUrl}/tx/0x${this.lastTransactionHash}`
  }

  get hint(): string {
    switch (this.state) {
      case PolyTransactionStatus.PENDING: // 1
        return 'Pending on source chain'
      case PolyTransactionStatus.SOURCE_DONE: // 2
        return 'Succeed on source chain, waiting for confirmation'
      case PolyTransactionStatus.SOURCE_CONFIRMED: // 3
        return 'Confirmed on source chain, waiting for Poly to handle'
      case PolyTransactionStatus.POLY_CONFIRMED: // 4
        return 'Confirmed on both source chain and Poly, target chain is pending'
      default:
        return 'Pending on source chain'
    }
  }
}

export class ApproveToken extends TransactionHistory {
  constructor(
    hash: string,
    public token: string,
    public blockExplorer,
    status?: TransactionStatus
  ) {
    super(hash, status)
  }

  TYPE = TransactionHistoryImplementationClassType.Approve

  get url(): string {
    return `${this.blockExplorer}/tx/${this.hash}`
  }

  toString(): string {
    return `Approve of using ${this.token}`
  }

}

export class MintXUSD extends TransactionHistory {
  constructor(hash: string, public amount: string, status?: TransactionStatus) {
    super(hash, status)
  }

  TYPE = TransactionHistoryImplementationClassType.Mint

  toString(): string {
    return `Mint ${this.amount} ShaUSD`
  }

  get url(): string {
    return `${process.env.BLOCK_EXPLORER_URL}/tx/${this.hash}`
  }
}

export class BurnXUSD extends TransactionHistory {
  constructor(hash: string, public amount: string, status?: TransactionStatus) {
    super(hash, status)
  }

  TYPE = TransactionHistoryImplementationClassType.Burn

  toString(): string {
    return `Burn ${this.amount} ShaUSD`
  }

  get url(): string {
    return `${process.env.BLOCK_EXPLORER_URL}/tx/${this.hash}`
  }
}

type TradeSynthType = 'Buy' | 'Sell'

export class TradeSynth extends TransactionHistory {

  constructor(
    hash: string,
    public amount: string,
    public type: TradeSynthType,
    public currencyKey: string,
    public toKey: string,
    status?: TransactionStatus
  ) {
    super(hash, status)
  }

  TYPE = TransactionHistoryImplementationClassType.Trade

  toString(): string {
    return `${this.type} ${this.amount} ${this.currencyKey} for ${this.toKey}`
  }

  get url(): string {
    return `${process.env.BLOCK_EXPLORER_URL}/tx/${this.hash}`
  }
}

TransactionHistory.fromJson = (json: { TYPE: string }): TransactionHistory | undefined => {
  const TYPE = json['TYPE']
  switch (TYPE) {
    case TransactionHistoryImplementationClassType.RedeemXUSD:
      return new RedeemXUSD(json['hash'], json['amount'], json['_status'])
    case TransactionHistoryImplementationClassType.RedeemDOWS:
      return new RedeemDOWS(json['hash'], json['amount'], json['_status'])
    case TransactionHistoryImplementationClassType.UnlockLP:
      return new UnlockLPToken(json['hash'], json['amount'], json['_status'])
    case TransactionHistoryImplementationClassType.LockLP:
      return new LockLPToken(json['hash'], json['amount'], json['_status'])
    case TransactionHistoryImplementationClassType.Bridge:
      return new BridgeDows(json['hash'], json['amount'], json['fromChainName'], json['toChainName'], json['_status'])
    case TransactionHistoryImplementationClassType.Approve:
      return new ApproveToken(json['hash'], json['token'], json['blockExplorer'], json['_status'])
    case TransactionHistoryImplementationClassType.Mint:
      return new MintXUSD(json['hash'], json['amount'], json['_status'])
    case TransactionHistoryImplementationClassType.Burn:
      return new BurnXUSD(json['hash'], json['amount'], json['_status'])
    case TransactionHistoryImplementationClassType.Trade:
      return new TradeSynth(json['hash'], json['amount'], json['type'], json['currencyKey'], json['toKey'], json['_status'])
  }

}
