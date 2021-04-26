/* eslint-disable no-unused-vars */

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

const TransactionHistoryImplementationClassType = {
  Redeem: 'Redeem',
  LockLP: 'LockLP',
  UnlockLP: 'UnlockLP'
}

export abstract class TransactionHistory {
  private _status: TransactionStatus
  hash: string

  protected constructor(hash: string, status?: TransactionStatus) {
    this.hash = hash
    this._status = status !== undefined ? status : TransactionStatus.WaitForConfirmation
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
    this._status = TransactionStatus.Completed
  }

  fail(): void {
    this._status = TransactionStatus.Failed
  }

  abstract TYPE

  abstract toString(): string

  static fromJson(_json: unknown): any {
    throw new Error('Not implementation')
  }
}

export class RedeemDows extends TransactionHistory {
  constructor(hash: string, public amount: string, status?: TransactionStatus) {
    super(hash, status)
  }

  TYPE = TransactionHistoryImplementationClassType.Redeem

  toString(): string {
    return `Redeem ${this.amount} DOWS`
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
}

export class UnlockLPToken extends TransactionHistory {
  constructor(hash: string, public amount: string, status?: TransactionStatus) {
    super(hash, status)
  }

  TYPE = TransactionHistoryImplementationClassType.UnlockLP

  toString(): string {
    return `Unlock ${this.amount} LP Tokens`
  }
}

TransactionHistory.fromJson = (json: { TYPE: string }): TransactionHistory | undefined => {
  const TYPE = json['TYPE']
  switch (TYPE) {
  case TransactionHistoryImplementationClassType.Redeem:
    return new RedeemDows(json['hash'], json['amount'], json['_status'])
  case TransactionHistoryImplementationClassType.UnlockLP:
    return new UnlockLPToken(json['hash'], json['amount'], json['_status'])
  case TransactionHistoryImplementationClassType.LockLP:
    return new LockLPToken(json['hash'], json['amount'], json['_status'])
  }
}
