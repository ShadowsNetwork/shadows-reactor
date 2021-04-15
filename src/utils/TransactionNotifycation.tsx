import { notification } from 'antd'
import React from 'react'
import { TransactionHistory } from '@/store/TransactionHistory/type'
import { CheckOutlined, LinkOutlined } from '@ant-design/icons'

const network = 'testnet'

export function notifyTransactionSuccess(transactionHistory: TransactionHistory): void {

  notification.open({
    message: '',
    duration: null,
    className: 'transaction-success',
    description: (
      <>
        <CheckOutlined />
        {transactionHistory.toString()}
        <LinkOutlined onClick={() => {
          window.open(`https://${network}.bscscan.com/tx/${transactionHistory.hash}`)
        }} />
      </>
    ),
    style: {
      width: 600
    }
  })
}

export function notifyTransactionFailed(transactionHistory: TransactionHistory): void {
  notification.open({
    message: '',
    duration: null,
    className: 'transaction-failed',
    description: (
      <>
        {'Failed - '}
        {transactionHistory.toString()}
        <LinkOutlined onClick={() => {
          window.open(`https://${network}.bscscan.com/tx/${transactionHistory.hash}`)
        }} />
      </>
    ),
    style: {
      width: 600
    }
  })
}
