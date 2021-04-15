import { TransactionStatus } from '@/types/TransactionHistory'
import React from 'react'
import { Button, Modal } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import './index.less'

export const mapTransactionStatusToIconAndLabel = new Map([
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
    icon: <CloseCircleOutlined />,
    color: '#de350b'
  }],
  [TransactionStatus.Completed.valueOf(), {
    icon: <CheckCircleOutlined />,
    color: '#63cca9'
  }],
  [TransactionStatus.Failed.valueOf(), {
    icon: <CloseOutlined />,
    color: '#de350b'
  }],
])

export type TransactionStatusModalProps = {
  status?: TransactionStatus
  visible: boolean
  onClose?: () => void
  errorMessage?: string
}

const TransactionStatusModal: React.FC<TransactionStatusModalProps> = ({
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
      className="transaction-status-modal"
      closable={false}
      visible={visible}
      footer={<></>}
    >
      <div className="icon" style={{ color }}>
        {icon}
      </div>
      <div style={{ color }}>
        {errorMessage}
      </div>
      <div className="label" style={{ color }}>
        {label}
      </div>
      {
        status !== TransactionStatus.WaitForConfirmation &&
        <Button onClick={onClose}>Dismiss</Button>
      }
    </Modal>
  )
}

export default TransactionStatusModal
