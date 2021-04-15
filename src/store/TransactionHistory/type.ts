export enum TransactionStatus {
  /**
   * Transaction is initialized, and waiting user to confirm in wallet.
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

export abstract class TransactionHistory {
  private _status: TransactionStatus
  hash: string

  constructor(hash: string) {
    this._status = TransactionStatus.WaitForConfirmation
    this.hash = hash
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

  abstract toString(): string
}

export class RedeemDows extends TransactionHistory {
  constructor(hash: string, public amount: string) {
    super(hash)
  }

  toString(): string {
    return `Redeem ${this.amount} DOWS`
  }
}

export class LockLPToken extends TransactionHistory {
  constructor(hash: string, public amount: string) {
    super(hash)
  }

  toString(): string {
    return `Lock ${this.amount} LP Tokens`
  }
}

export class UnlockLPToken extends TransactionHistory {
  constructor(hash: string, public amount: string) {
    super(hash)
  }

  toString(): string {
    return `Unlock ${this.amount} LP Tokens`
  }
}
