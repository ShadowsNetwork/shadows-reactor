import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Dropdown, Input, Menu } from 'antd'
import GasPrice from '@/components/GasPrice'
import '../../styles/dropDown.css'
import './index.less'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { bytesToString, weiToString, toWei } from '@/web3/utils'
import { LoadingOutlined } from '@ant-design/icons'
import TransactionStatus from '@/components/TransactionStatus'
import {
  initTransaction,
  onTransactionConfirmed,
  onTransactionException
} from '@/components/TransactionStatus/event'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'

function DropdownMenu(props) {
  const {
    onChange,
    currencies,
    selectedCurrency
  } = props

  return (
    <Menu defaultSelectedKeys={selectedCurrency} selectable>
      {currencies.map(currency => (
        <Menu.Item onClick={() => {
          onChange(currency)
        }} key={currency} className="menu-item">
          <span>
            {currency}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  )
}

function Action() {
  const { t } = useTranslation()
  const account = useSelector(getAccount)

  // const {
  //   onConfirm,
  //   onComplete
  // } = props

  const [currencyKeys, setCurrencyKeys] = useState([])
  const [selectedCurrency, setSelectedCurrency] = useState()
  const [destinationAccount, setDestinationAccount] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [balance, setBalance] = useState()

  const [transactionStatus, setTransactionStatus] = useState({
    hash: null,
    error: null,
    exception: null,
    success: false,
    inProgress: false,
    toBeConfirmed: false,
    closed: false
  })

  const fetchAvailableCurrencyKeys = useCallback(async () => {
    const availableCurrencyKeys = (await dowsJSConnector.dowsJs.Shadows.availableCurrencyKeys()).map(k => bytesToString(k))
    setCurrencyKeys(availableCurrencyKeys)
    setSelectedCurrency(availableCurrencyKeys[0])
  }, [])
  useEffect(() => {
    fetchAvailableCurrencyKeys()
  }, [fetchAvailableCurrencyKeys])

  const fetchBalance = useCallback(async () => {
    setBalance(null)
    if (selectedCurrency) {
      const balanceOf = await dowsJSConnector.dowsJs.Synth[selectedCurrency].balanceOf(account)
      setBalance(weiToString(balanceOf))
    }
  }, [account, selectedCurrency])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const handleTransfer = async () => {
    initTransaction(setTransactionStatus)

    const to = destinationAccount
    const value = toWei(inputValue)
    dowsJSConnector.dowsJs.Synth[selectedCurrency].transfer(to, value)
      .then(r => {
        setInputValue('')
        onTransactionConfirmed(setTransactionStatus, r)
      })
      .catch(e => {
        onTransactionException(setTransactionStatus, e)
      })
  }

  return (
    <div className="transfer">
      <div className="transfer-title">
        <span>{t('transfer.title')}</span>
        <span>{t('transfer.text')}</span>
      </div>
      <div className="transfer-content">
        <div className="transfer-content-title">
          <span>{t('transfer.amount')}</span>
          <span>
            {t('transaction.available')}
            ：
            {/* eslint-disable-next-line no-nested-ternary */}
            {balance ?? <LoadingOutlined />}
          </span>
        </div>
        <div className="transfer-input">
          {currencyKeys.length === 0 ? <LoadingOutlined style={{
            color: 'white',
            fontSize: '3rem',
            marginLeft: '1rem'
          }} /> : ''}
          <Dropdown
            trigger="click"
            overlay={(
              <DropdownMenu
                onChange={currency => {
                  setSelectedCurrency(currency)
                }}
                selectedCurrency={selectedCurrency}
                currencies={currencyKeys}
              />
            )}
            overlayStyle={{
              height: '300px',
              overflowY: 'scroll'
            }}
            placement="bottomLeft"
          >
            <a>
              <span>
                {selectedCurrency}
              </span>
            </a>
          </Dropdown>
          <Input
            value={inputValue}
            className="amount-input"
            bordered={false}
            onChange={(event => {
              setInputValue(event.target.value)
            })}
          />
          <span className="all" onClick={() => {
            setInputValue(balance)
          }}>
            {t('transaction.all')}
          </span>
        </div>
        <div className="transfer-content">
          <div className="transfer-content-title">
            <span>{t('transfer.destinationAddress')}</span>
          </div>
          <div className="transfer-input">
            <Input
              className="address-input"
              bordered={false}
              onChange={(event => {
                setDestinationAccount(event.target.value)
              })}
              placeholder="e.g. 0x185f5a"
            />
          </div>
        </div>
      </div>
      <div className="transfer-bottom">
        <Button
          onClick={handleTransfer}
          disabled={
            !inputValue ||
            !destinationAccount ||
            transactionStatus.toBeConfirmed
          }
        >
          {transactionStatus.toBeConfirmed ? <LoadingOutlined /> : ''}
          {t('transfer.sendNow')}
        </Button>
        <GasPrice />
        <TransactionStatus
          {...transactionStatus}
          closed={transactionStatus.closed}
          onClosed={() => setTransactionStatus({
            ...transactionStatus,
            closed: true
          })}
          content={t('transactionStatus.transactionType.transfer')}
        />
        <div className="error-message">
          {transactionStatus.error && transactionStatus.error.message}
        </div>
      </div>
    </div>
  )
}

export default Action
