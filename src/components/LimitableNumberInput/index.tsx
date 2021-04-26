import { Input, message } from 'antd'
import { InputProps } from 'antd/lib/input/Input'
import React, { Dispatch, SetStateAction } from 'react'
import BigNumber from 'bignumber.js'
import assert from 'assert'

interface LimitableNumberInputProp extends InputProps {
  max?: string
  min?: string
  inputValue: string
  inputValueSetter: Dispatch<SetStateAction<string>>
  decimalPlaces?: number
}
// '1'
// '1.123456789012345678'
// '1.1234567890123456780'
const LimitableNumberInput: React.FC<LimitableNumberInputProp> = ({
  min,
  max,
  inputValue,
  inputValueSetter,
  decimalPlaces,
  ...inputProps
}) => {
  const reg = decimalPlaces ? new RegExp(`^\\d+(\\.\\d{0,${decimalPlaces}})?$`) : /^\d+(.\d+)?$/

  if (min) {
    assert(min.length === 0 || reg.test(min))
  }
  if (max) {
    assert(max.length === 0 || reg.test(max))
  }

  const onKeyPress = (e: { key: string; preventDefault: () => void }) => {
    if (!/[.\d]/.test(e.key)) {
      e.preventDefault()
    }
  }

  const onChange = (e: { target: { value: string } }) => {
    if (!e.target.value) {
      inputValueSetter('')
      return
    }

    if (!reg.test(e.target.value)) {
      message.warning('The input value is up to 18th decimal place', 0.5)
      return
    }

    if (max) {
      if (new BigNumber(e.target.value).lt(new BigNumber(max))) {
        inputValueSetter(e.target.value)
      } else {
        inputValueSetter(max.toString())
      }
    }

    if (min) {
      if (new BigNumber(e.target.value).gt(new BigNumber(min))) {
        inputValueSetter(e.target.value)
      } else {
        inputValueSetter(min.toString())
      }
    }
  }

  return (
    <Input
      value={inputValue}
      onKeyPress={onKeyPress}
      onChange={onChange}
      {...inputProps}
    />
  )
}

export default LimitableNumberInput
