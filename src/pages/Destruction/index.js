import React, { useCallback, useEffect, useState } from 'react'
import './index.css'
import '../../styles/dropDown.css'
import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import GasPrice from '@/components/GasPrice'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import {
  fromWei, toBigNumber, toByte32, toWei,
} from '@/web3/utils'
import { useWeb3React } from '@web3-react/core'
import { LoadingOutlined } from '@ant-design/icons'

function Destruction() {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [xUSD, setXUSD] = useState(null)
  const [burnAmountToFixRatio, setBurnAmountToFixRatio] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState('')
  const [outputLoading, setOutputLoading] = useState(false)
  const [transactionInProgress, setTransactionInProgress] = useState(false)

  const handleInputKeyPress = e => {
    if (!/[\d.]/.test(e.key)) {
      e.preventDefault()
    }
  }

  const handleInputOnChange = e => {
    if (!e.target.value) {
      setInputValue('')
    } else if (parseFloat(e.target.value) <= xUSD) {
      setInputValue(e.target.value)
    } else if (parseFloat(e.target.value) > xUSD) {
      setInputValue(xUSD)
    }
  }

  const burnSynths = async () => {
    setTransactionInProgress(true)
    const amount = toWei(inputValue)
    const r = await dowsJSConnector.dowsJs.Shadows.burnSynths(amount)
    setTransactionInProgress(false)
    console.log(r)
  }

  const fetchDowsByXUsd = useCallback(async () => {
    const rateForCurrency = await dowsJSConnector.dowsJs.ExchangeRates.rateForCurrency(toByte32('xUSD'))
    setOutputLoading(false)
    setOutputValue(toBigNumber(fromWei(rateForCurrency))
      .multipliedBy(toBigNumber(inputValue))
      .toString())
  }, [inputValue])

  useEffect(() => {
    if (inputValue && /^\d+(\.\d+)?$/.test(inputValue)) {
      setTimeout(() => {
        setOutputLoading(true)
        fetchDowsByXUsd()
      }, 500)
    }
  }, [inputValue])

  const fetchInitData = useCallback(async () => {
    const [xUSDBalance, debtBalance, maxIssuableSynth] = await Promise.all([
      dowsJSConnector.dowsJs.Synth.xUSD.balanceOf(account),
      dowsJSConnector.dowsJs.Shadows.debtBalanceOf(account, toByte32('xUSD')),
      dowsJSConnector.dowsJs.Shadows.maxIssuableSynths(account),
    ])

    setXUSD(fromWei(xUSDBalance))
    setBurnAmountToFixRatio(Math.max(fromWei(debtBalance) - fromWei(maxIssuableSynth), 0))
  }, [account])

  useEffect(() => {
    fetchInitData()
  }, [fetchInitData])

  return (
    <div className="destruction">
      <div className="destruction-title">
        <span>{t('destroy.title')}</span>
        <span>{t('destroy.text')}</span>
      </div>
      <div className="operation">
        <Button onClick={() => setInputValue(burnAmountToFixRatio)}>
          {t('destroy.adjust')}
        </Button>
        <Button onClick={() => setInputValue(xUSD)}>
          {t('destroy.destroyAll')}
        </Button>
      </div>
      <div className="destruction-content">
        <div className="destruction-content-title">
          <span>
            {t('destroy.balance')}
            ：
          </span>
          <span>{xUSD ? `${xUSD} xUSD` : <LoadingOutlined />}</span>
        </div>
        <div className="destruction-input">
          <div className="prefix">
            <div className="dot" />
            <span className="text">
              xUSD
            </span>
          </div>
          <Input
            className="input"
            value={inputValue}
            bordered={false}
            onKeyPress={handleInputKeyPress}
            onChange={handleInputOnChange}
          />
        </div>
      </div>
      <div className="destruction-content">
        <div className="destruction-content-title">
          <span>{t('destroy.quantity')}</span>
        </div>
        <div className="destruction-input">
          <div className="prefix">
            <div className="dot" />
            <span className="text">
              DOWS
            </span>
          </div>
          <div className="output">
            {outputLoading ? <LoadingOutlined /> : outputValue}
          </div>
        </div>
      </div>
      <div className="destruction-bottom">
        <Button onClick={burnSynths}>
          {transactionInProgress ? <LoadingOutlined /> : ''}
          {t('destroy.start')}
        </Button>
        <GasPrice />
      </div>
    </div>
  )
}

export default Destruction
