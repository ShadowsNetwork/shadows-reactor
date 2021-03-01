import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button, Dropdown, Input, Menu,
} from 'antd'
import GasPrice from '@/components/GasPrice'

import { useWeb3React } from '@web3-react/core'
import '../../styles/dropDown.css'
import './index.less'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { bytesToString, fromWei, toWei } from '@/web3/utils'
import { LoadingOutlined } from '@ant-design/icons'

function DropdownMenu(props) {
  const { onChange, currencies, selectedCurrency } = props

  return (
    <Menu defaultSelectedKeys={selectedCurrency} selectable>
      {currencies.map(currency => (
        <Menu.Item onClick={() => { onChange(currency) }} key={currency} className="menu-item">
          <span>
            {currency}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  )
}

function Action(props) {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const { onConfirm, onComplete } = props

  const [currencyKeys, setCurrencyKeys] = useState([])
  const [selectedCurrency, setSelectedCurrency] = useState()
  const [destinationAccount, setDestinationAccount] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [balance, setBalance] = useState()
  const [gasPrice, setGasPrice] = useState(0)

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
      setBalance(fromWei(balanceOf))
    }
  }, [account, selectedCurrency])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const handleTransfer = async () => {
    onConfirm(inputValue, destinationAccount)
    const to = destinationAccount
    const value = toWei(inputValue)
    dowsJSConnector.dowsJs.Synth[selectedCurrency].transfer(to, value).then(result => {
      onComplete(result)
    }).catch(error => {
      console.error(error)
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
          {currencyKeys.length === 0 ? <LoadingOutlined style={{ color: 'white', fontSize: '3rem', marginLeft: '1rem' }} /> : ''}
          <Dropdown
            trigger="click"
            overlay={(
              <DropdownMenu
                onChange={currency => { setSelectedCurrency(currency) }}
                selectedCurrency={selectedCurrency}
                currencies={currencyKeys}
              />
            )}
            overlayStyle={{ height: '300px', overflowY: 'scroll' }}
            placement="bottomLeft"
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
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
            onChange={(event => { setInputValue(event.target.value) })}
          />
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <span className="all" onClick={() => { setInputValue(balance) }}>
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
              onChange={(event => { setDestinationAccount(event.target.value) })}
              placeholder="e.g. 0x185f5a"
            />
          </div>
        </div>
      </div>
      <div className="transfer-bottom">
        <Button
          onClick={handleTransfer}
        >
          {t('transfer.sendNow')}
        </Button>
        <GasPrice onChange={price => { setGasPrice(price) }} />
      </div>
    </div>
  )
}

export default Action
