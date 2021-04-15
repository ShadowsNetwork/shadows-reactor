import { notification } from 'antd'
import React from 'react'
import { TransactionHistory } from '@/types/TransactionHistory'
import { CheckOutlined, CloseOutlined, LinkOutlined } from '@ant-design/icons'

const network = 'testnet'

const closeIcon = (color: string) => (
  <div style={{ color }}>
    <CloseOutlined />
  </div>
)

export function notifyTransactionSuccess(transactionHistory: TransactionHistory): void {
  const color = '#63cca9'

  notification.open({
    message: '',
    duration: null,
    className: 'transaction-success',
    closeIcon: closeIcon(color),
    description: (
      <div style={{ color }}>
        <CheckOutlined />
        {transactionHistory.toString()}
        <LinkOutlined onClick={() => {
          window.open(`https://${network}.bscscan.com/tx/${transactionHistory.hash}`)
        }} />
      </div>
    ),
    style: {
      width: 440,
      backgroundColor: '#000000'
    }
  })
}

export function notifyTransactionFailed(transactionHistory: TransactionHistory): void {
  const color = '#63cca9'

  notification.open({
    message: '',
    duration: null,
    className: 'transaction-failed',
    closeIcon: closeIcon(color),
    description: (
      <div style={{ color }}>
        {'Failed - '}
        {transactionHistory.toString()}
        <LinkOutlined onClick={() => {
          window.open(`https://${network}.bscscan.com/tx/${transactionHistory.hash}`)
        }} />
      </div>
    ),
    style: {
      width: 440,
      backgroundColor: '#000000'
    }
  })
}
