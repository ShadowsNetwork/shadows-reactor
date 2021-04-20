import { TransactionStatus } from '@/types/TransactionHistory'
import React from 'react'
import { Button, Modal } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import './index.less'
import vector from '@/img/status/Vector.png'

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
    icon: <div className="transactionError">
      <div className="transactionErrorIcon">
        <img src={vector}/>
      </div>
    </div>,
    color: '#de350b'
  }],
  [TransactionStatus.Completed.valueOf(), {
    icon: <CheckOutlined />,
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
      {
        status !== TransactionStatus.WaitForConfirmation &&
        <Button className="dismiss" onClick={onClose}>Dismiss</Button>
      }
    </Modal>
  )
}

export default TransactionStatusModal
