import { Input, message } from 'antd'
import { InputProps } from 'antd/lib/input/Input'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import BigNumber from 'bignumber.js'

interface LimitableNumberInputProp extends InputProps {
  maximum?: BigNumber | string | number
  minimum?: BigNumber | string | number
  inputValue: string
  setInputValue: Dispatch<SetStateAction<string>>
  decimalPlaces?: number
}

const LimitableNumberInput: React.FC<LimitableNumberInputProp> = ({
  minimum,
  maximum,
  inputValue,
  setInputValue,
  decimalPlaces = 18,
  ...inputProps
}) => {
  // ^([0]|([^0]\d*))(\.\d*)?$
  const reg = decimalPlaces ? new RegExp(`^\\d+(\\.\\d{0,${decimalPlaces}})?$`) : /^\d+(.\d+)?$/

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
    if (maximum && new BigNumber(inputValue).gt(new BigNumber(maximum))) {
      setInputValue(maximum.toString())
    }

    if (minimum && new BigNumber(inputValue).lt(new BigNumber(minimum))) {
      setInputValue(minimum.toString())
    }
  }, [maximum, minimum, inputValue])

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
