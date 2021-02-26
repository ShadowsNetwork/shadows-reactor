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
import BigNumber from 'bignumber.js'

function Synthesis() {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [available, setAvailable] = useState()
  const [staking, setStaking] = useState()
  const [totalBalance, setTotalBalance] = useState(null)
  const [transactionInProgress, setTransactionInProgress] = useState(false)

  const fetchDataFromContract = useCallback(async () => {
    const [
      [availableBalance, stakingBalance],
      dowsBalance,
    ] = await Promise.all([
      dowsJSConnector.dowsJs.Shadows.remainingIssuableSynths(account),
      dowsJSConnector.dowsJs.Shadows.balanceOf(account),
    ])

    setAvailable(fromWei(availableBalance))
    setStaking(fromWei(stakingBalance))
    setTotalBalance(fromWei(dowsBalance))
  }, [account])

  useEffect(() => {
    fetchDataFromContract()
  }, [fetchDataFromContract])

  const [inputValue, setInputValue] = useState('')

  const issueSynth = async () => {
    setTransactionInProgress(true)
    const amount = toWei(inputValue)
    const r = await dowsJSConnector.dowsJs.Shadows.issueSynths(amount)
    setTransactionInProgress(false)
    console.log(r)
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
              {
                totalBalance && staking
                  ? `${new BigNumber((staking / totalBalance)).multipliedBy(100).dp(8)}  %`
                  : <LoadingOutlined />
              }
            </span>
          </div>
        </div>
        <div className="Synthesis-bottom">
          <Button onClick={issueSynth}>
            {transactionInProgress ? <LoadingOutlined /> : ''}
            {t('synthesis.start')}
          </Button>
          <GasPrice />
        </div>
      </div>
    </div>
  )
}

export default Synthesis
