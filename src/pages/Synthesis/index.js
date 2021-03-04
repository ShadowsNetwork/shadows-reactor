import React, { useCallback, useEffect, useState } from 'react'
import './index.css'
import '../../styles/dropDown.css'
import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import GasPrice from '@/components/GasPrice'
import { useWeb3React } from '@web3-react/core'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { LoadingOutlined } from '@ant-design/icons'
import { fromWei, toWei } from '@/web3/utils'
import TransactionInProgress from '@/components/TransactionStatus/TransactionInProgress'
import TransactionCompleted from '@/components/TransactionStatus/TransactionCompleted'

function Synthesis() {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [available, setAvailable] = useState()
  const [staking, setStaking] = useState()
  const [myRatio, setMyRatio] = useState(null)

  const [transaction, setTransaction] = useState({
    hash: null,
    error: null,
    success: false,
    inProgress: false,
    toBeConfirmed: false
  })

  const fetchDataFromContract = useCallback(async () => {
    const [
      [availableBalance, stakingBalance],
      collateralisationRatio
    ] = await Promise.all([
      dowsJSConnector.dowsJs.Shadows.remainingIssuableSynths(account),
      dowsJSConnector.dowsJs.Shadows.collateralisationRatio(account)
    ])

    setAvailable(fromWei(availableBalance))
    setStaking(fromWei(stakingBalance))
    setMyRatio(fromWei(collateralisationRatio))
  }, [account])

  useEffect(() => {
    fetchDataFromContract()
  }, [fetchDataFromContract])

  const [inputValue, setInputValue] = useState('')

  const onTransactionCompleted = ({ transactionHash: hash }) => {
    setTransaction({
      hash,
      error: null,
      success: true,
      inProgress: false,
      toBeConfirmed: false
    })
    fetchDataFromContract()
  }

  const onTransactionConfirmed = ({
    hash,
    wait
  }) => {
    setInputValue('')
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

  const issueSynth = async () => {
    initTransaction()
    dowsJSConnector.dowsJs.Shadows.issueSynths(toWei(inputValue))
      .then(onTransactionConfirmed)
      .catch(onTransactionException)
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
            <span>{available ? `${available} DOWS` : <LoadingOutlined />}</span>
          </div>
          <div className="Synthesis-input">
            <div className="prefix">
              <div className="dot" />
              <span className="text">
                DOWS
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
              {t('synthesis.staking')}
              {': '}
              {staking ? `${staking} DOWS` : <LoadingOutlined />}
            </span>
            <span>
              {t('synthesis.debtRatio')}
              {': '}
              {myRatio ? `${Math.round(100 / myRatio)} %` : <LoadingOutlined />}
            </span>
          </div>
        </div>
        <div className="Synthesis-bottom">
          <Button
            onClick={issueSynth}
            disabled={
              transaction.toBeConfirmed ||
              !available ||
              !inputValue
            }
          >
            {transaction.toBeConfirmed ? <LoadingOutlined /> : ''}
            {t('synthesis.start')}
          </Button>
          <GasPrice />
          <TransactionInProgress
            {...transaction}
            content={t('transactionStatus.transactionType.synthesis')}
          />
          <TransactionCompleted
            {...transaction}
            content={t('transactionStatus.transactionType.synthesis')}
          />
          <div className="error-message">
            {transaction.error && transaction.error.message}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Synthesis
