import useEthGasPriceQuery from '@/web3/useEthGasPriceQuery'
import { useTranslation } from 'react-i18next'
import React, { useEffect, useReducer } from 'react'
import { Button, InputNumber, Popover } from 'antd'
import '../styles/network.css'

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
      <InputNumber onChange={handleInputChange} style={{ width: '90px' }} />
      <Button style={{ display: 'block', marginTop: '15px' }} type="text" onClick={() => handleInputChange(fastest)}>
        <span>{t('gasPrice.fastest')}</span>
        <span style={{ marginLeft: '38px' }}>{fastest}</span>
      </Button>
      <Button style={{ display: 'block', marginTop: '15px' }} type="text" onClick={() => handleInputChange(fast)}>
        <span>{t('gasPrice.fast')}</span>
        <span style={{ marginLeft: '38px' }}>{fast}</span>
      </Button>
      <Button style={{ display: 'block', marginTop: '15px' }} type="text" onClick={() => handleInputChange(average)}>
        <span>{t('gasPrice.average')}</span>
        <span style={{ marginLeft: '38px' }}>{average}</span>
      </Button>
    </>
  )
}

function GasPrice(props) {
  const { onChange } = props

  const ethGasPriceQuery = useEthGasPriceQuery()

  const { data } = ethGasPriceQuery

  const { t } = useTranslation()

  const initialState = { price: 0 }

  const reducer = (state, action) => ({ price: action.payload })

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (data) dispatch({ payload: data.fast })
  }, [data])

  useEffect(() => {
    if (onChange) {
      onChange(state.price)
    }
  }, [state.price])

  return (
    <>
      <span>
        {t('gasPrice.networkFee')}
        { `：$0 / ${state.price} GWEI` }
      </span>
      <Popover placement="rightTop" content={<PopoverContent price={data} dispatch={dispatch} />}>
        <div className="edit">
          <div />
        </div>
      </Popover>
    </>
  )
}

export default GasPrice
