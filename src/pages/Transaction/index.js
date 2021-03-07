import React, { useCallback, useEffect, useState } from 'react'
import { Button, Dropdown, Input, Menu } from 'antd'
import './index.css'
import '@/styles/dropDown.css'
import { useTranslation } from 'react-i18next'
import GasPrice from '@/components/GasPrice'
import { LoadingOutlined } from '@ant-design/icons'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { useWeb3React } from '@web3-react/core'
import { bytesToString, fromWei, toBigNumber, toByte32, toWei } from '@/web3/utils'
import {
  initTransaction,
  onTransactionConfirmed,
  onTransactionException
} from '@/components/TransactionStatus/event'
import TransactionStatus from '@/components/TransactionStatus'

function MenuContent(props) {
  const {
    defaultSelectedKey,
    onSelect,
    currencyKeys
  } = props

  const currencies = currencyKeys.map(key => ({ name: key }))

  return (
    <Menu
      defaultSelectedKeys={[defaultSelectedKey]}
      onSelect={onSelect}
      selectable
    >
      {currencies.map(currency => (
        <Menu.Item
          className="menu-item"
          key={currency.name}
        >
          <span
            className="icon"
            // style={{ background: currency.icon }}
          />
          <span className="text">
            {currency.name}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  )
}

function InputPrefixCurrency(props) {
  const {
    currencyKey,
    currencyKeys
  } = props

  const currencies = currencyKeys.map(key => ({ name: key }))

  const currency = currencies.filter(c => c.name === currencyKey)[0]

  return (
    <div className="input-prefix-currency">
      <div
        className="icon"
        // style={{ background: currency.icon }}
      />
      <span className="text">
        {currency ? currency.name : ''}
      </span>
    </div>
  )
}

function Transaction() {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [sourceCurrencyKey, setSourceCurrencyKey] = useState()
  const [destinationCurrencyKey, setDestinationCurrencyKey] = useState()

  const [sourceDropdownVisible, setSourceDropdownVisible] = useState(false)
  const [destinationDropdownVisible, setDestinationDropdownVisible] = useState(false)

  const [synthBalance, setSynthBalance] = useState(null)

  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState('')
  const [outputLoading, setOutputLoading] = useState(false)

  const [sourceRate, setSourceRate] = useState('')
  const [destinationRate, setDestinationRate] = useState('')

  const [currencyKeys, setCurrencyKeys] = useState([])

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
    } else if (parseFloat(e.target.value) <= synthBalance) {
      setInputValue(e.target.value)
    } else if (parseFloat(e.target.value) > synthBalance) {
      setInputValue(synthBalance)
    }
  }

  const AllButton = () => {
    return (
      <span
        onClick={() => {
          setInputValue(synthBalance)
        }}
        className="all"
        style={{
          position: 'absolute',
          right: '1.5rem',
          fontSize: '1.6rem'
        }}
      >
        {t('transaction.all')}
      </span>
    )
  }

  const fetchAvailableCurrencyKeys = useCallback(async () => {
    const availableCurrencyKeys = (await dowsJSConnector.dowsJs.Shadows.availableCurrencyKeys()).map(k => bytesToString(k))
    setCurrencyKeys(availableCurrencyKeys)
    setSourceCurrencyKey(availableCurrencyKeys[0])
    setDestinationCurrencyKey(availableCurrencyKeys[1])
  }, [])
  useEffect(() => {
    fetchAvailableCurrencyKeys()
  }, [fetchAvailableCurrencyKeys])

  const fetchSynthBalance = useCallback(async () => {
    if (sourceCurrencyKey) {
      setSynthBalance(null)
      const balance = await dowsJSConnector.dowsJs.Synth[sourceCurrencyKey].balanceOf(account)
      setSynthBalance(fromWei(balance))
    }
  }, [account, sourceCurrencyKey])

  useEffect(() => {
    fetchSynthBalance()
  }, [fetchSynthBalance])

  const calculateOutput = useCallback(() => {
    setOutputValue(
      toBigNumber(sourceRate)
        .multipliedBy(toBigNumber(inputValue))
        .dividedBy(destinationRate)
        .toString()
    )
    setOutputLoading(false)
  }, [inputValue, sourceRate, destinationRate])

  useEffect(() => {
    if (!inputValue) {
      setOutputValue('')
    } else {
      if (sourceRate && destinationRate) {
        calculateOutput()
      }
    }
  }, [calculateOutput])

  const fetchSourceRate = useCallback(async () => {
    setInputValue('')
    setOutputValue('')
    const sourceRateForCurrency = fromWei(await dowsJSConnector.dowsJs.ExchangeRates.rateForCurrency(toByte32(sourceCurrencyKey)))
    setSourceRate(sourceRateForCurrency)
  }, [sourceCurrencyKey])

  useEffect(() => {
    fetchSourceRate()
  }, [fetchSourceRate])

  const fetchDestinationRate = useCallback(async () => {
    if (outputValue && inputValue) {
      setOutputLoading(true)
    }
    const destinationRateForCurrency = fromWei(await dowsJSConnector.dowsJs.ExchangeRates.rateForCurrency(toByte32(destinationCurrencyKey)))
    setDestinationRate(destinationRateForCurrency)
  }, [destinationCurrencyKey])

  useEffect(() => {
    fetchDestinationRate()
  }, [fetchDestinationRate])

  const handleExchange = async () => {
    initTransaction(setTransactionStatus)

    dowsJSConnector.dowsJs.Shadows.exchange(
      toByte32(sourceCurrencyKey),
      toWei(inputValue),
      toByte32(destinationCurrencyKey)
    )
      .then(r => {
        setInputValue('')
        setOutputValue('')
        onTransactionConfirmed(setTransactionStatus, r)
      })
      .catch(e => {
        onTransactionException(setTransactionStatus, e)
      })
  }

  return (
    <div className="transaction">
      <div className="transaction-title">
        <span>{t('transaction.title')}</span>
        <span>{t('transaction.text')}</span>
      </div>
      <div className="transaction-content">
        <div className="transaction-content-title">
          <span>{t('transaction.pay')}</span>
          <span>
            {t('transaction.available')}
            {': '}
            {synthBalance ?? <LoadingOutlined />}
          </span>
        </div>
        <div className="transaction-input">
          {currencyKeys.length === 0 ? <LoadingOutlined style={{
            color: 'white',
            fontSize: '3rem',
            marginLeft: '1rem'
          }} /> : ''}
          <Dropdown
            trigger="click"
            placement="bottomLeft"
            overlay={(
              <MenuContent
                onSelect={({ key }) => {
                  setSourceCurrencyKey(key)
                  setSourceDropdownVisible(false)
                }}
                defaultSelectedKey={sourceCurrencyKey}
                anotherMenuSelectedKey={destinationCurrencyKey}
                currencyKeys={currencyKeys}
              />
            )}
            overlayStyle={{
              height: '300px',
              overflowY: 'scroll'
            }}
            visible={sourceDropdownVisible}
            onVisibleChange={v => setSourceDropdownVisible(v)}
          >
            <a>
              <InputPrefixCurrency
                currencyKey={sourceCurrencyKey}
                currencyKeys={currencyKeys}
              />
            </a>
          </Dropdown>

          <Input
            value={inputValue}
            onKeyPress={handleInputKeyPress}
            onChange={handleInputOnChange}
            bordered={false}
            className="input"
            suffix={<AllButton />}
          />
        </div>
      </div>
      <div className="transaction-content">
        <div className="transaction-content-title">
          <span>{t('transaction.receive')}</span>
          <span>{t('transaction.estimated')}</span>
        </div>
        <div className="transaction-input">
          {currencyKeys.length === 0 ? <LoadingOutlined style={{
            color: 'white',
            fontSize: '3rem',
            marginLeft: '1rem'
          }} /> : ''}
          <Dropdown
            trigger="click"
            placement="bottomLeft"
            overlay={(
              <MenuContent
                onSelect={({ key }) => {
                  setDestinationCurrencyKey(key)
                  setDestinationDropdownVisible(false)
                }}
                defaultSelectedKey={destinationCurrencyKey}
                anotherMenuSelectedKey={sourceCurrencyKey}
                currencyKeys={currencyKeys}
              />
            )}
            overlayStyle={{
              height: '300px',
              overflowY: 'scroll'
            }}
            visible={destinationDropdownVisible}
            onVisibleChange={v => setDestinationDropdownVisible(v)}
          >
            <a>
              <InputPrefixCurrency
                currencyKey={destinationCurrencyKey}
                currencyKeys={currencyKeys}
              />
            </a>
          </Dropdown>
          <div className="output">
            {outputLoading && <LoadingOutlined />}
            {!outputLoading && outputValue}
          </div>
        </div>
      </div>
      <div className="transaction-content-bottom">
        <span>
          {t('transaction.fees')}
          ：0.3%
        </span>
      </div>
      <div className="transaction-bottom">
        <Button
          onClick={handleExchange}
          disabled={
            sourceCurrencyKey === destinationCurrencyKey ||
            !inputValue ||
            transactionStatus.toBeConfirmed ||
            parseInt(inputValue) <= 0
          }
        >
          {transactionStatus.toBeConfirmed ? <LoadingOutlined /> : ''}
          {t('transaction.title')}
        </Button>
        <GasPrice />
        <TransactionStatus
          {...transactionStatus}
          closed={transactionStatus.closed}
          onClosed={() => setTransactionStatus({
            ...transactionStatus,
            closed: true
          })}
          content={t('transactionStatus.transactionType.transaction')}
        />
        <div className="error-message">
          {transactionStatus.error && transactionStatus.error.message}
        </div>
      </div>
    </div>
  )
}

export default Transaction
