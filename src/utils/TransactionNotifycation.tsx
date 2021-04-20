import { notification } from 'antd'
import React from 'react'
import { TransactionHistory } from '@/types/TransactionHistory'
import { CheckOutlined, CloseOutlined, LinkOutlined } from '@ant-design/icons'
import './notifycation.less'
import promptShare from '@/img/status/promptShare.png'


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
      <div className="prompt" style={{ color }}>
        <CheckOutlined />
        <div className="promptContent">
          <span className="promptText">{transactionHistory.toString()}</span>
          <img src={promptShare} className="promptImg" onClick={() => {
            window.open(`https://${network}.bscscan.com/tx/${transactionHistory.hash}`)
          }} />
        </div>
      </div>
    ),
    style: {
      width: 440,
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
        <span>{transactionHistory.toString()}</span>
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
