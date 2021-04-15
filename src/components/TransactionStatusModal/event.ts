import { Dispatch, SetStateAction } from 'react'
import { TransactionStatusModalProps } from '@/components/TransactionStatusModal/index'
import { TransactionStatus } from '@/store/TransactionHistory/type'

type TransactionStatusSetter = Dispatch<SetStateAction<TransactionStatusModalProps>>

export function beginTransaction(props: TransactionStatusModalProps, setter: TransactionStatusSetter): void {
  setter({
    ...props,
    visible: true,
    status: TransactionStatus.WaitForConfirmation,
  })
}

export function submitTransaction(props: TransactionStatusModalProps, setter: TransactionStatusSetter): void {
  setter({
    ...props,
    visible: true,
    status: TransactionStatus.Submitted,
  })
}

export function rejectTransaction(props: TransactionStatusModalProps, setter: TransactionStatusSetter, errorMessage?: string): void {
  setter({
    ...props,
    visible: true,
    status: TransactionStatus.SignatureError,
    errorMessage
  })
}
