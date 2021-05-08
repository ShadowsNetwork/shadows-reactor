import { notification } from 'antd'
import React from 'react'
import { TransactionHistory } from '@/types/TransactionHistory'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import './notifycation.less'
import { ReactComponent as LinkIcon } from '@/img/link.svg'

const CloseIcon = () => (
  <div style={{ color: '#bebebe', position: 'relative', top: '0.5rem' }}>
    <CloseOutlined />
  </div>
)

export function notifyTransactionSuccess(transactionHistory: TransactionHistory): void {
  const color = '#63cca9'

  notification.open({
    placement: 'bottomRight',
    message: '',
    // duration: null,
    className: 'transaction-success',
    closeIcon: CloseIcon(),
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
      width: 'fit-content',
      paddingRight: '4.5rem'
    }
  })
}

export function notifyTransactionFailed(transactionHistory: TransactionHistory): void {
  const color = '#de350b'

  notification.open({
    placement: 'bottomRight',
    message: '',
    // duration: null,
    className: 'transaction-failed',
    closeIcon: CloseIcon(),
    description: (
      <div className="prompt" style={{ color }}>
        <ExclamationCircleOutlined />
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
      width: 'fit-content',
      paddingRight: '4.5rem'
    }
  })
}
