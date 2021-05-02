import { Input, message } from 'antd'
import { InputProps } from 'antd/lib/input/Input'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import assert from 'assert'

interface LimitableNumberInputProp extends InputProps {
  max?: string
  min?: string
  inputValue: string
  setInputValue: Dispatch<SetStateAction<string>>
  decimalPlaces?: number
}

const LimitableNumberInput: React.FC<LimitableNumberInputProp> = ({
  min,
  max,
  inputValue,
  setInputValue,
  decimalPlaces,
  ...inputProps
}) => {
  // ^([0]|([^0]\d*))(\.\d*)?$
  const reg = decimalPlaces ? new RegExp(`^\\d+(\\.\\d{0,${decimalPlaces}})?$`) : /^\d+(.\d+)?$/

  assert(!min || min.length === 0 || reg.test(min))
  assert(!max || max.length === 0 || reg.test(max))

  const onKeyPress = (event: any) => {
    if (!/[.\d]/.test(event.key)) {
      event.preventDefault()
    }
  }

  const onChange = (e: any) => {
    if (!e.target.value) {
      setInputValue('')
      return
    }

    if (!reg.test(e.target.value)) {
      if (decimalPlaces && new RegExp(`^\\d+(\\.\\d{${decimalPlaces + 1},})?$`).test(e.target.value)) {
        message.warning(`The input value is up to ${decimalPlaces}th decimal place`, 0.5)
      }
      return
    }

    setInputValue(
      e.target
        .value
        .replace(/^0([1-9]+)$/, '$1')
        .replace(/^0+$/, '0')
    )
  }

  useEffect(() => {
    if (max && new BigNumber(inputValue).gt(new BigNumber(max))) {
      setInputValue(max)
    }

    if (min && new BigNumber(inputValue).lt(new BigNumber(min))) {
      setInputValue(min)
    }
  }, [max, min, inputValue])

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
