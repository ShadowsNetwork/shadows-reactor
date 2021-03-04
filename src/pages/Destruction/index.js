import React, { useCallback, useEffect, useState } from 'react'
import './index.css'
import '../../styles/dropDown.css'
import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import GasPrice from '@/components/GasPrice'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import {
  fromWei, toBigNumber, toByte32, toWei
} from '@/web3/utils'
import { useWeb3React } from '@web3-react/core'
import { LoadingOutlined } from '@ant-design/icons'
import TransactionInProgress from '@/components/TransactionStatus/TransactionInProgress'
import TransactionCompleted from '@/components/TransactionStatus/TransactionCompleted'

function Destruction() {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [xUSD, setXUSD] = useState(null)
  const [burnAmountToFixRatio, setBurnAmountToFixRatio] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState('')
  const [outputLoading, setOutputLoading] = useState(false)

  const [transaction, setTransaction] = useState({
    hash: null,
    error: null,
    success: false,
    inProgress: false,
    toBeConfirmed: false
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
      dowsJSConnector.dowsJs.Shadows.maxIssuableSynths(account)
    ])

    setXUSD(fromWei(xUSDBalance))
    setBurnAmountToFixRatio(Math.max(fromWei(debtBalance) - fromWei(maxIssuableSynth), 0))
  }, [account])

  useEffect(() => {
    fetchInitData()
  }, [fetchInitData])

  const onTransactionCompleted = ({ transactionHash: hash }) => {
    setTransaction({
      hash,
      error: null,
      success: true,
      inProgress: false,
      toBeConfirmed: false
    })
    fetchInitData()
  }

  const onTransactionConfirmed = ({
    hash,
    wait
  }) => {
    setInputValue('')
    setOutputValue('')
    setTransaction({
      hash,
      error: null,
      success: false,
      inProgress: true,
      toBeConfirmed: false
    })

    wait()
      .then(onTransactionCompleted)
  }

  const onTransactionException = error => {
    setTransaction({
      hash: null,
      error,
      success: false,
      inProgress: false,
      toBeConfirmed: false
    })
  }

  const initTransaction = () => {
    setTransaction({
      hash: null,
      error: null,
      success: false,
      inProgress: false,
      toBeConfirmed: true
    })
  }

  const burnSynths = async () => {
    initTransaction()
    dowsJSConnector.dowsJs.Shadows.burnSynths(toWei(inputValue))
      .then(onTransactionConfirmed)
      .catch(onTransactionException)
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
        <Button
          onClick={burnSynths}
          disabled={
            transaction.toBeConfirmed ||
            !xUSD ||
            !inputValue
          }
        >
          {transaction.toBeConfirmed ? <LoadingOutlined /> : ''}
          {t('destroy.start')}
        </Button>
        <GasPrice />
        <TransactionInProgress
          {...transaction}
          content={t('transactionStatus.transactionType.burn')}
        />
        <TransactionCompleted
          {...transaction}
          content={t('transactionStatus.transactionType.burn')}
        />
        <div className="error-message">
          {transaction.error && transaction.error.message}
        </div>
      </div>
    </div>
  )
}

export default Destruction
