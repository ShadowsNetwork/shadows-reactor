import { Input } from 'antd'
import { InputProps } from 'antd/lib/input/Input'
import React, { Dispatch, SetStateAction } from 'react'
import BigNumber from 'bignumber.js'
import assert from 'assert'

interface LimitableNumberInputProp extends InputProps {
  max?: string | number;
  min?: string | number;
  inputValue: string,
  inputValueSetter: Dispatch<SetStateAction<string>>
}

const LimitableNumberInput: React.FC<LimitableNumberInputProp> = prop => {
  const {
    min,
    max,
    inputValue,
    inputValueSetter,
    ...inputProps
  } = prop

  if (typeof min === 'string') {
    assert(min.length === 0 || /\d+(.\d+)?/.test(min))
  }
  if (typeof max === 'string') {
    assert(max.length === 0 || /\d+(.\d+)?/.test(max))
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
