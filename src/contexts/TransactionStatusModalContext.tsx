import { TransactionStatus } from '@/types/TransactionHistory'
import React, { useContext, useState } from 'react'
import { Button, Modal } from 'antd'
import {
  CheckCircleOutlined, CheckOutlined, CloseOutlined, LoadingOutlined
} from '@ant-design/icons'
import vector from '@/img/status/Vector.png'

const mapTransactionStatusToIconAndLabel = new Map([
  [TransactionStatus.WaitForConfirmation.valueOf(), {
    icon: <LoadingOutlined />,
    label: 'Wait For Confirmation',
    color: '#63cca9'
  }],
  [TransactionStatus.Submitted.valueOf(), {
    icon: <CheckCircleOutlined />,
    label: 'Submitted',
    color: '#63cca9'
  }],
  [TransactionStatus.SignatureError.valueOf(), {
    icon: (
      <div className="transactionError">
        <div className="transactionErrorIcon">
          <img src={vector} alt="" />
        </div>
      </div>
    ),
    color: '#de350b'
  }],
  [TransactionStatus.Completed.valueOf(), {
    icon: <CheckOutlined />,
    color: '#63cca9'
  }],
  [TransactionStatus.Failed.valueOf(), {
    icon: <CloseOutlined />,
    color: '#de350b'
  }]
])

export type TransactionStatusModalStatus = {
  status?: TransactionStatus
  visible: boolean
  onClose?: () => void
  errorMessage?: string
}

const TransactionStatusModalContext = React.createContext({
  beginTransaction: () => {
    return
  },
  submitTransaction: () => {
    return
  },
  rejectTransaction: (_errorMessage: string) => {
    return
  }
})

const TransactionStatusModal: React.FC<TransactionStatusModalStatus> = ({
  status,
  visible,
  onClose,
  errorMessage
}) => {
  const icon = status !== undefined ? (mapTransactionStatusToIconAndLabel.get(status)?.icon) : null
  const label = status !== undefined ? (mapTransactionStatusToIconAndLabel.get(status)?.label) : null
  const color = status !== undefined ? (mapTransactionStatusToIconAndLabel.get(status)?.color) : '#ffffff'

  return (
    <Modal
      title=""
      className="transaction-status-modal"
      closable={false}
      visible={visible}
      footer=""
    >
      <div className="message" style={{ color }}>
        {errorMessage}
      </div>
      <div className="label" style={{ color }}>
        {label}
      </div>
      <div className="icon" style={{ color }}>
        {icon}
      </div>
      <Button className="dismiss" onClick={onClose}>Dismiss</Button>
    </Modal>
  )
}

const TransactionStatusModalProvider: React.FC = ({ children }) => {
  const [status, setStatus] = useState<TransactionStatusModalStatus>({ visible: false })

  const beginTransaction = () => {
    setStatus({
      ...status,
      visible: true,
      status: TransactionStatus.WaitForConfirmation,
      errorMessage: ''
    })
  }

  const submitTransaction = () => {
    setStatus({
      ...status,
      visible: true,
      status: TransactionStatus.Submitted,
      errorMessage: ''
    })
  }

  const rejectTransaction = (errorMessage: string) => {
    setStatus({
      ...status,
      visible: true,
      status: TransactionStatus.SignatureError,
      errorMessage
    })
  }

  const onClose = () => {
    setStatus({
      ...status,
      visible: false
    })
  }

  return (
    <TransactionStatusModalContext.Provider value={{  beginTransaction,  submitTransaction,  rejectTransaction }}>
      {children}

      <TransactionStatusModal {...status} onClose={onClose} />
    </TransactionStatusModalContext.Provider>
  )
}

const useTransactionStatusModal = () => {
  return useContext(TransactionStatusModalContext)
}

export {
  TransactionStatusModalProvider, useTransactionStatusModal
}

