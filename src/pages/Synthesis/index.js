import React, { useCallback, useEffect, useState } from 'react'
import './index.css'
import '../../styles/dropDown.css'
import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import GasPrice from '@/components/GasPrice'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { LoadingOutlined } from '@ant-design/icons'
import { weiToString, toWei } from '@/web3/utils'
import TransactionStatus from '@/components/TransactionStatus'
import {
  initTransaction,
  onTransactionConfirmed,
  onTransactionException
} from '@/components/TransactionStatus/event'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'

function Synthesis() {
  const { t } = useTranslation()
  const account = useSelector(getAccount)

  const [available, setAvailable] = useState()
  const [collateralized, setCollateralized] = useState()
  const [myRatio, setMyRatio] = useState(null)

  const [transactionStatus, setTransactionStatus] = useState({
    hash: null,
    error: null,
    exception: null,
    success: false,
    inProgress: false,
    toBeConfirmed: false,
    closed: false
  })

  const fetchDataFromContract = useCallback(async () => {
    const [
      dowsBalance,
      transferableDows,
      [remainingIssuableSynths],
      collateralisationRatio
    ] = await Promise.all([
      dowsJSConnector.dowsJs.Shadows.balanceOf(account),
      dowsJSConnector.dowsJs.Shadows.transferableShadows(account),
      dowsJSConnector.dowsJs.Shadows.remainingIssuableSynths(account),
      dowsJSConnector.dowsJs.Shadows.collateralisationRatio(account)
    ])

    setAvailable(weiToString(remainingIssuableSynths))
    setCollateralized(weiToString(dowsBalance.sub(transferableDows)))
    setMyRatio(weiToString(collateralisationRatio))
  }, [account])

  useEffect(() => {
    fetchDataFromContract()
  }, [fetchDataFromContract])

  const [inputValue, setInputValue] = useState('')

  const issueSynth = async () => {
    initTransaction(setTransactionStatus)
    dowsJSConnector.dowsJs.Shadows.issueSynths(toWei(inputValue))
      .then(r => {
        setInputValue('')
        onTransactionConfirmed(setTransactionStatus, r)
      })
      .catch(e => {
        onTransactionException(setTransactionStatus, e)
      })
  }

  const handleInputKeyPress = e => {
    if (!/[\d.]/.test(e.key)) {
      e.preventDefault()
    }
  }

  const handleInputOnChange = e => {
    if (!e.target.value) {
      setInputValue('')
    } else if (parseFloat(e.target.value) <= available) {
      setInputValue(e.target.value)
    } else if (parseFloat(e.target.value) > available) {
      setInputValue(available)
    }
  }

  const AllButton = (
    <Button
      type="text"
      disabled={!available}
      className="all"
      style={{ fontSize: '1.6rem' }}
      onClick={() => {
        setInputValue(available)
      }}
    >
      {t('synthesis.all')}
    </Button>
  )

  return (
    <div className="bg">
      <div className="Synthesis">
        <div className="Synthesis-title">
          <span>{t('synthesis.title')}</span>
          <span>{t('synthesis.text')}</span>
        </div>
        <div className="Synthesis-content">
          <div className="Synthesis-content-title">
            <span>
              {t('synthesis.balance')}
              ：
            </span>
            <span>{available ? `${available} xUSD` : <LoadingOutlined />}</span>
          </div>
          <div className="Synthesis-input">
            <div className="prefix">
              <div className="dot" />
              <span className="text">
                xUSD
              </span>
            </div>
            <Input
              disabled={!available}
              className="input"
              value={inputValue}
              bordered={false}
              onKeyPress={handleInputKeyPress}
              onChange={handleInputOnChange}
              suffix={AllButton}
            />
          </div>
          <div className="Synthesis-content-bottom">
            <span>
              {t('synthesis.collateralized')}
              {': '}
              {collateralized ?? <LoadingOutlined />}
            </span>
            <span>
              {t('synthesis.debtRatio')}
              {': '}
              {myRatio && (parseFloat(myRatio) !== 0 ? `${Math.round(100 / myRatio)} %` : 0)}
            </span>
          </div>
        </div>
        <div className="Synthesis-bottom">
          <Button
            onClick={issueSynth}
            disabled={
              transactionStatus.toBeConfirmed ||
              !available ||
              !inputValue
            }
          >
            {transactionStatus.toBeConfirmed ? <LoadingOutlined /> : ''}
            {t('synthesis.start')}
          </Button>
          <GasPrice />
          <TransactionStatus
            {...transactionStatus}
            closed={transactionStatus.closed}
            onClosed={() => setTransactionStatus({
              ...transactionStatus,
              closed: true
            })}
            content={t('transactionStatus.transactionType.synthesis')}
          />
          <div className="error-message">
            {transactionStatus.error && transactionStatus.error.message}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Synthesis
