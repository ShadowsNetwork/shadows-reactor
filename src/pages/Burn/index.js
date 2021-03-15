import React, { useCallback, useEffect, useState } from 'react'
import './index.css'
import '../../styles/dropDown.css'
import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import GasPrice from '@/components/GasPrice'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { fromWei, toBigNumber, toByte32, toWei } from '@/web3/utils'
import { LoadingOutlined } from '@ant-design/icons'
import {
  initTransaction,
  onTransactionConfirmed,
  onTransactionException
} from '@/components/TransactionStatus/event'
import TransactionStatus from '@/components/TransactionStatus'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'

function Burn() {
  const { t } = useTranslation()
  const account = useSelector(getAccount)

  const [xUSD, setXUSD] = useState(null)
  const [burnAmountToFixRatio, setBurnAmountToFixRatio] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState('')
  const [outputLoading, setOutputLoading] = useState(false)

  const [transactionStatus, setTransactionStatus] = useState({
    hash: null,
    error: null,
    exception: null,
    success: false,
    inProgress: false,
    toBeConfirmed: false,
    closed: false
  })

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

  const fetchDowsByXUsd = useCallback(async () => {
    const [xUSDRate, dowsRate] = await Promise.all([
      dowsJSConnector.dowsJs.ExchangeRates.rateForCurrency(toByte32('xUSD')),
      dowsJSConnector.dowsJs.ExchangeRates.rateForCurrency(toByte32('DOWS'))
    ])
    setOutputLoading(false)
    setOutputValue(
      toBigNumber(fromWei(xUSDRate))
        .dividedBy(toBigNumber(fromWei(dowsRate)))
        .multipliedBy(toBigNumber(inputValue))
        .toString()
    )
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
    const [debtBalance, maxIssuableSynth] = await Promise.all([
      dowsJSConnector.dowsJs.Shadows.debtBalanceOf(account, toByte32('xUSD')),
      dowsJSConnector.dowsJs.Shadows.maxIssuableSynths(account)
    ])
    setXUSD(fromWei(debtBalance))
    setBurnAmountToFixRatio(Math.max(fromWei(debtBalance) - fromWei(maxIssuableSynth), 0))
  }, [account])

  useEffect(() => {
    fetchInitData()
  }, [fetchInitData])

  const burnSynths = async amount => {
    initTransaction(setTransactionStatus)
    dowsJSConnector.dowsJs.Shadows.burnSynths(amount)
      .then(r => {
        setInputValue('')
        setOutputValue('')
        onTransactionConfirmed(setTransactionStatus, r)
      })
      .catch(e => {
        onTransactionException(setTransactionStatus, e)
      })
  }

  const burnAll = async () => {
    setInputValue(xUSD)
    initTransaction(setTransactionStatus)
    const xUSDBalance = await dowsJSConnector.dowsJs.Synth.xUSD.balanceOf(account)
    await burnSynths(xUSDBalance)
  }

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
        <Button onClick={burnAll}>
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
        <Button
          onClick={() => burnSynths(toWei(inputValue))}
          disabled={
            transactionStatus.toBeConfirmed ||
            !xUSD ||
            !inputValue
          }
        >
          {transactionStatus.toBeConfirmed ? <LoadingOutlined /> : ''}
          {t('destroy.start')}
        </Button>
        <GasPrice />
        <TransactionStatus
          {...transactionStatus}
          closed={transactionStatus.closed}
          onClosed={() => setTransactionStatus({
            ...transactionStatus,
            closed: true
          })}
          content={t('transactionStatus.transactionType.burn')}
        />
        <div className="error-message">
          {transactionStatus.exception && transactionStatus.exception.message}
        </div>
      </div>
    </div>
  )
}

export default Burn
