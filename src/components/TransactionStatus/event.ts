import { Dispatch, SetStateAction } from 'react'
import { TransactionStatusType } from '@/components/TransactionStatus/props'
import { TransactionResponse } from '@/ShadowsJs/contracts/type'

type TransactionSetter = Dispatch<SetStateAction<TransactionStatusType>>

function onTransactionCompleted(setTransactionStatus: TransactionSetter, transactionHash: string): void {
  setTransactionStatus({
    hash: transactionHash,
    error: null,
    exception: null,
    success: true,
    inProgress: false,
    toBeConfirmed: false,
    closed: false
  })
}

function onTransactionFailed(setTransactionStatus: TransactionSetter, error: any): void {
  setTransactionStatus({
    hash: error.transactionHash,
    error: error,
    exception: null,
    success: false,
    inProgress: false,
    toBeConfirmed: false,
    closed: false
  })
}

function onTransactionConfirmed(setTransactionStatus: TransactionSetter, result: TransactionResponse): void {
  const {
    hash,
    wait
  } = result

  setTransactionStatus({
    hash,
    error: null,
    exception: null,
    success: false,
    inProgress: true,
    toBeConfirmed: false,
    closed: false
  })

  wait()
    .then(confirmation => {
      const { transactionHash } = confirmation
      onTransactionCompleted(setTransactionStatus, transactionHash)
      // fetchInitData()
    })
    .catch((error: Error) => {
      onTransactionFailed(setTransactionStatus, error)
    })
}

function onTransactionException(setTransactionStatus: TransactionSetter, exception: Error): void {
  setTransactionStatus({
    hash: null,
    error: null,
    exception,
    success: false,
    inProgress: false,
    toBeConfirmed: false,
    closed: false
  })
}

function initTransaction(setTransactionStatus: TransactionSetter): void {
  setTransactionStatus({
    hash: null,
    error: null,
    exception: null,
    success: false,
    inProgress: false,
    toBeConfirmed: true,
    closed: false
  })
}

export {
  onTransactionCompleted,
  onTransactionFailed,
  onTransactionException,
  initTransaction,
  onTransactionConfirmed
}
