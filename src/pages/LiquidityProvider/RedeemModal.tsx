import React from 'react'
import { Button, Modal } from 'antd'
import dowsIcon from '@/img/dows-info/dows.png'
import BigNumber from 'bignumber.js'

export type RedeemModalStatus = {
  visible: boolean
  amount: string
  onConfirm?: () => void
  onClose?: () => void
}

const RedeemModal: React.FC<RedeemModalStatus> = ({
  amount,
  visible,
  onClose,
  onConfirm
}) => {
  return (
    <Modal
      title="Redeem Reward"
      visible={visible}
      okText="Confirm"
      onOk={onConfirm}
      onCancel={onClose}
      footer=""
    >
      <div className="redeemContent">
        <img src={dowsIcon} className="redeem-modal-dows-icon" alt="" />
        <span className="redeem-modal-text">
          {`${amount} DOWS Available`}
        </span>
      </div>
      <div className="redeemFoot">
        <Button key="back" className="onClose" onClick={onClose}>Cancel</Button>
        <Button
          key="redeem"
          className="redeem"
          onClick={onConfirm}
          disabled={new BigNumber(amount).lte(new BigNumber(0))}
        >
          Redeem
        </Button>
      </div>
    </Modal>
  )
}

export default RedeemModal
