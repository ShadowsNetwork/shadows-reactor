import { notification } from 'antd'
import React from 'react'
import { TransactionHistory } from '@/types/TransactionHistory'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import './notifycation.less'
import { ReactComponent as LinkIcon } from '@/img/link.svg'

const CloseIcon = (color: string) => (
  <div style={{ color }}>
    <CloseOutlined />
  </div>
)

export function notifyTransactionSuccess(transactionHistory: TransactionHistory): void {
  const color = '#63cca9'

  notification.open({
    message: '',
    className: 'transaction-success',
    closeIcon: CloseIcon(color),
    description: (
      <div className="prompt" style={{ color }}>
        <CheckOutlined />
        <div className="promptContent">
          <span className="promptText">
            {transactionHistory.toString()}
          </span>
          <LinkIcon
            fill={color}
            className="promptImg"
            onClick={() => {
              window.open(`${process.env.BLOCK_EXPLORER_URL}/tx/${transactionHistory.hash}`)
            }}
          />
        </div>
      </div>
    ),
    style: {
      top: 60,
      width: 'fit-content'
    }
  })
}

export function notifyTransactionFailed(transactionHistory: TransactionHistory): void {
  const color = '#de350b'

  notification.open({
    message: '',
    className: 'transaction-failed',
    closeIcon: CloseIcon(color),
    description: (
      <div style={{ color }}>
        {'Failed - '}
        <span>
          {transactionHistory.toString()}
        </span>
        <LinkIcon
          fill={color}
          className="promptImg"
          onClick={() => {
            window.open(`${process.env.BLOCK_EXPLORER_URL}/tx/${transactionHistory.hash}`)
          }}
        />
      </div>
    ),
    style: {
      top: 60,
      width: 440,
      backgroundColor: '#000000'
    }
  })
}
