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
import TransactionInProgress from '@/components/TransactionInProgress'
import TransactionCompleted from '@/components/TransactionCompleted'

function Synthesis() {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [available, setAvailable] = useState()
  const [staking, setStaking] = useState()
  const [myRatio, setMyRatio] = useState(null)

  const [transaction, setTransaction] = useState({
    hash: null, error: null, success: false, inProgress: false, toBeConfirmed: false,
  })

  const fetchDataFromContract = useCallback(async () => {
    const [
      [availableBalance, stakingBalance],
      collateralisationRatio,
    ] = await Promise.all([
      dowsJSConnector.dowsJs.Shadows.remainingIssuableSynths(account),
      dowsJSConnector.dowsJs.Shadows.collateralisationRatio(account),
    ])

    setAvailable(fromWei(availableBalance))
    setStaking(fromWei(stakingBalance))
    setMyRatio(fromWei(collateralisationRatio))
  }, [account])

  useEffect(() => {
    fetchDataFromContract()
  }, [fetchDataFromContract])

  const [inputValue, setInputValue] = useState('')

  const issueSynth = async () => {
    setTransaction({
      hash: null, error: null, success: false, inProgress: false, toBeConfirmed: true,
    })
    const amount = toWei(inputValue)
    dowsJSConnector.dowsJs.Shadows.issueSynths(amount).then(r => {
      const { hash } = r
      setTransaction({
        hash, error: null, success: false, inProgress: true, toBeConfirmed: false,
      })
      r.wait().then(res => {
        setTransaction({
          hash, error: null, success: true, inProgress: false, toBeConfirmed: false,
        })
      })
    }).catch(error => {
      setTransaction({
        hash: null, error, success: false, inProgress: false, toBeConfirmed: false,
      })
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

  const AllBtn = (
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
              className="input"
              value={inputValue}
              bordered={false}
              onKeyPress={handleInputKeyPress}
              onChange={handleInputOnChange}
              suffix={AllBtn}
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
          <Button onClick={issueSynth} disabled={transaction.toBeConfirmed}>
            {transaction.toBeConfirmed ? <LoadingOutlined /> : ''}
            {t('synthesis.start')}
          </Button>
          <GasPrice />
          {
            transaction.hash && transaction.inProgress && (
              <TransactionInProgress
                content={t('transaction.inProgress.content.synthesis')}
                hash={transaction.hash}
              />
            )
          }
          {
            transaction.hash && transaction.success && (
              <TransactionCompleted
                content={t('transaction.inProgress.content.synthesis')}
                hash={transaction.hash}
              />
            )
          }
          <div className="error-message">
            {transaction.error && transaction.error.message}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Synthesis
