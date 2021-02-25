import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button, Dropdown, Input, Menu,
} from 'antd'
import GasPrice from '@/components/GasPrice'
import useBalanceQuery from '@/web3/useBalanceQuery'
import { formatEther } from '@ethersproject/units'

import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import { injected } from '@/web3/connectors'

const availableCurrentType = [
  { name: 'xETH', iconColor: '#4444FF' },
  { name: 'xUSD', iconColor: '#de2c2c' },
  { name: 'xETC', iconColor: '#03AF91' },
  { name: 'xJPY', iconColor: '#D2417E' },
  { name: 'xEUR', iconColor: '#464146' },
]

function MenuItemContent(props) {
  const { value, iconColor } = props
  return (
    <div>
      <span
        style={{
          display: 'inline-block',
          width: '15px',
          height: '15px',
          borderRadius: '15px',
          background: iconColor,
        }}
      />
      <span style={{
        marginLeft: '10px',
        color: '#B9B1B7',
        fontSize: '8pt',
      }}
      >
        {value}
      </span>
    </div>
  )
}

function DropdownMenu(props) {
  const { onChange } = props

  return (
    <Menu>
      {availableCurrentType.map((type) => (
        <Menu.Item onClick={() => { onChange(type.name) }} key={type.name}>
          <MenuItemContent value={type.name} iconColor={type.iconColor} />
        </Menu.Item>
      ))}
    </Menu>
  )
}

async function handleSendTransfer(
  context, amount, destinationAccount, gasPrice, onConfirm, onComplete,
) {
  onConfirm(amount, destinationAccount)
  const { account } = context

  let web3
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider)
  } else {
    web3 = new Web3(injected)
  }

  const transactionParams = {
    // nonce: web3.utils.toHex(txCount),
    from: account,
    to: destinationAccount,
    value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
    // gasLimit: web3.utils.toHex(21000),
    gasPrice: web3.utils.toHex(web3.utils.toWei(gasPrice.toString(), 'gwei')),
  }

  window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParams],
    from: account,
  }).then((result) => {
    onComplete(result)
  }).catch((error) => {
    console.log(error)
  })
}

function CurrentCurrencyType(props) {
  const { currencyType } = props
  const { iconColor, name } = currencyType
  return (
    <>
      <div
        style={{
          width: '15px',
          height: '15px',
          borderRadius: '15px',
          background: iconColor,
        }}
      />
      <span
        style={{
          marginLeft: '10px',
          color: '#B9B1B7',
          fontSize: '8pt',
        }}
      >
        {name}
      </span>
    </>
  )
}

function Action(props) {
  const { t } = useTranslation()

  const { balance } = useBalanceQuery()

  const { onConfirm, onComplete } = props

  const context = useWeb3React()

  const [selectedCurrencyName, setSelectedCurrencyName] = useState(availableCurrentType[0].name)

  const [destinationAccount, setDestinationAccount] = useState('')

  const [amount, setAmount] = useState('')

  const [gasPrice, setGasPrice] = useState(0)

  const getCurrencyType = (availableCurrentType.filter(
    (type) => type.name === selectedCurrencyName,
  ))[0]

  const onDropdownMenuChange = (name) => { setSelectedCurrencyName(name) }

  const handleGasPriceChange = (price) => { setGasPrice(price) }

  return (
    <div className="transaction">
      <div className="transaction-title">
        <span>{t('transfer.title')}</span>
        <span>{t('transfer.text')}</span>
      </div>
      <div className="transaction-content">
        <div className="transaction-content-title">
          <span>{t('transfer.amount')}</span>
          <span>
            {t('transaction.available')}
            ：
            {/* eslint-disable-next-line no-nested-ternary */}
            {balance === null ? 'Error' : balance ? `${formatEther(balance)}ETH` : ''}
          </span>
        </div>
        <div className="transaction-input">
          <Dropdown overlay={<DropdownMenu onChange={onDropdownMenuChange} />} placement="bottomLeft">
            <Button
              style={{
                height: '4.3rem',
                background: 'none',
                border: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CurrentCurrencyType currencyType={getCurrencyType} />
            </Button>
          </Dropdown>
          <Input
            onChange={((event) => { setAmount(event.target.value) })}
            style={{
              width: '60%',
              height: '4.3rem',
              background: 'none',
              border: 0,
              outline: 'none',
              color: '#fff',
            }}
          />
          <Button
            type="text"
            className="all"
            style={{
              position: 'absolute',
              right: '0px',
              fontSize: '1.6rem',
              lineHeight: '0',
            }}
          >
            {t('transaction.all')}
          </Button>
        </div>
        <div className="transaction-content">
          <div className="transaction-content-title">
            <span>{t('transfer.destinationAddress')}</span>
          </div>
          <div className="transaction-input">
            <Input
              onChange={((event) => { setDestinationAccount(event.target.value) })}
              placeholder="e.g. 0x185f5a"
              style={{
                width: '100%',
                height: '4.3rem',
                background: 'none',
                border: 0,
                outline: 'none',
                color: '#fff',
              }}
            />
          </div>
        </div>
      </div>
      <div className="transaction-bottom">
        <Button
          onClick={() => {
            handleSendTransfer(context,
              amount, destinationAccount, gasPrice, onConfirm, onComplete)
          }}
        >
          {t('transfer.sendNow')}
        </Button>
        <GasPrice onChange={handleGasPriceChange} />
      </div>
    </div>
  )
}

export default Action
