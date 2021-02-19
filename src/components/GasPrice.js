import useEthGasPriceQuery from '@/web3/useEthGasPriceQuery'
import { useTranslation } from 'react-i18next'
import React, { useEffect, useReducer } from 'react'
import { Button, InputNumber, Popover } from 'antd'

function PopoverContent(props) {
  const { t } = useTranslation()
  const { dispatch } = props
  let { price } = props
  if (!price) {
    price = { fastest: 0, fast: 0, average: 0 }
  }
  const { fastest, fast, average } = price

  const handleInputChange = (e) => {
    dispatch({ payload: e })
  }

  return (
    <>
      <Button type="text" onClick={() => handleInputChange(fastest)}>
        <span>{t('gasPrice.fastest')}</span>
        {': '}
        <span>{fastest}</span>
      </Button>
      <Button type="text" onClick={() => handleInputChange(fast)}>
        <span>{t('gasPrice.fast')}</span>
        {': '}
        <span>{fast}</span>
      </Button>
      <Button type="text" onClick={() => handleInputChange(average)}>
        <span>{t('gasPrice.average')}</span>
        {': '}
        <span>{average}</span>
      </Button>
      <InputNumber onChange={handleInputChange} />
    </>
  )
}

function GasPrice() {
  const ethGasPriceQuery = useEthGasPriceQuery()

  const { data } = ethGasPriceQuery

  const { t } = useTranslation()

  const initialState = { price: 0 }

  const reducer = (state, action) => ({ price: action.payload })

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (data) dispatch({ payload: data.fast })
  }, [data])

  return (
    <>
      <span>
        {t('gasPrice.networkFee')}
        { `：$0 / ${state.price} GWEI` }
      </span>
      <Popover content={<PopoverContent price={data} dispatch={dispatch} />}>
        <span style={{ marginLeft: '5px', color: '#8500fe' }}>{t('gasPrice.edit')}</span>
      </Popover>
    </>
  )
}

export default GasPrice
