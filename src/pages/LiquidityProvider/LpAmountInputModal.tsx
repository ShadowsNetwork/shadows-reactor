import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, message, Modal } from 'antd'
import LimitableNumberInput from '@/components/LimitableNumberInput'
import { numberWithCommas } from '@/utils'
import './amount-input-modal.css'

export type LpAmountInputModalStatus = {
  visible: boolean,
  title: string,
  confirmCallback?: (_: string) => void,
  cancelCallback?: () => void
  maxAvailable: string,
}

const LpAmountInputModal: React.FC<LpAmountInputModalStatus> = ({
  title,
  visible,
  maxAvailable,
  confirmCallback,
  cancelCallback
}) => {
  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    if (visible) {
      setInputValue('')
    }
  }, [visible])

  const handleConfirm = () => {
    if (new BigNumber(inputValue).lte(new BigNumber('0'))) {
      message.error('Value should gather than zero!')
      return
    }

    if (new BigNumber(inputValue).gt(new BigNumber(maxAvailable))) {
      message.error('Insufficient balance!')
      return
    }
    confirmCallback?.(inputValue)
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={cancelCallback}
      footer={null}
    >
      <span className="available">{numberWithCommas(maxAvailable)} DOWS/ETH Available</span>
      <span className="input-dows">
        <LimitableNumberInput
          min={0}
          max={maxAvailable}
          inputValue={inputValue}
          inputValueSetter={setInputValue}
          allowClear={true}
        />
        <span className="dows">DOWS</span>
        <Button onClick={() => setInputValue(maxAvailable)}>MAX</Button>
      </span>
      <div className="stakeButton">
        <Button onClick={cancelCallback}>Cancel</Button>
        <Button onClick={handleConfirm} disabled={inputValue.length === 0}>Confirm</Button>
      </div>
    </Modal>
  )
}

export default LpAmountInputModal
