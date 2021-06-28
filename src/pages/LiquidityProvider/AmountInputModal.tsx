import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, message, Modal } from 'antd'
import LimitableNumberInput from '@/components/LimitableNumberInput'
import { numberWithCommas } from '@/utils'
import './index.less'

export type AmountInputModalStatus = {
  visible: boolean,
  title: string,
  confirmCallback?: (_: string) => void,
  cancelCallback?: () => void
  maxAvailable: string | number | BigNumber,
  unit: string
}

const AmountInputModal: React.FC<AmountInputModalStatus> = ({
  title,
  unit,
  visible,
  maxAvailable,
  confirmCallback,
  cancelCallback,
}) => {
  const [inputValue, setInputValue] = useState<string>('0')

  useEffect(() => {
    if (visible) {
      setInputValue('')
    }
  }, [visible])

  const handleConfirm = () => {
    if (new BigNumber(inputValue).lte(new BigNumber('0'))) {
      message.error('Value should greater than 0!')
      return
    }

    if (new BigNumber(inputValue).gt(new BigNumber(maxAvailable))) {
      message.error('Insufficient balance!')
      return
    }
    confirmCallback?.(inputValue)
  }

  const handleCancel = () => {
    cancelCallback && cancelCallback()
  }

  return (
    <Modal
      wrapClassName="amount-input-modal"
      zIndex={999}
      title={title}
      visible={visible}
      onCancel={cancelCallback}
      footer={null}
    >
      <span className="available">{`${numberWithCommas(maxAvailable, 6)} ${unit} Available`}</span>
      <span className="input-dows">
        <LimitableNumberInput
          minimum="0"
          maximum={Number(maxAvailable.toString()).toFixed(6)}
          decimalPlaces={6}
          inputValue={inputValue}
          setInputValue={setInputValue}
          allowClear={true}
        />
        <span className="dows">{unit}</span>
        <Button onClick={() => setInputValue(Number(maxAvailable.toString()).toFixed(6))}>MAX</Button>
      </span>
      <div className="stakeButton">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleConfirm} disabled={!inputValue || new BigNumber(inputValue).lte(0)}>Confirm</Button>
      </div>
    </Modal>
  )
}

export default AmountInputModal
