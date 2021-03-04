import React, { useCallback, useEffect, useState } from 'react'
import './index.css'
import '../../styles/dropDown.css'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import GasPrice from '@/components/GasPrice'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { useWeb3React } from '@web3-react/core'
import { fromWei, toBigNumber } from '@/web3/utils'
import { LoadingOutlined } from '@ant-design/icons'
import TransactionInProgress from '@/components/TransactionStatus/TransactionInProgress'
import TransactionCompleted from '@/components/TransactionStatus/TransactionCompleted'

function Reward() {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [tradingReward, setTradingReward] = useState('0')
  const [syntheticReward, setSyntheticReward] = useState('0')

  const [claimRewardDisabled, setClaimRewardDisabled] = useState(true)

  const [transaction, setTransaction] = useState({
    hash: null,
    error: null,
    success: false,
    inProgress: false,
    toBeConfirmed: false
  })

  const fetchClaimFees = useCallback(async () => {
    setTradingReward(null)
    setSyntheticReward(null)
    const [tradingRewardFee, syntheticRewardFee] = await dowsJSConnector.dowsJs.FeePool.feesAvailable(account)
    setTradingReward(fromWei(tradingRewardFee))
    setSyntheticReward(fromWei(syntheticRewardFee))
  }, [])
  useEffect(() => {
    fetchClaimFees()
  }, [fetchClaimFees])

  useEffect(() => {
    const canClaimReward = toBigNumber(tradingReward).gt(toBigNumber('0')) || toBigNumber(syntheticReward).gt(toBigNumber('0'))
    setClaimRewardDisabled(!canClaimReward)
  }, [tradingReward, syntheticReward])

  const onTransactionCompleted = ({ transactionHash: hash }) => {
    setTransaction({
      hash,
      error: null,
      success: true,
      inProgress: false,
      toBeConfirmed: false
    })
    fetchClaimFees()
  }

  const onTransactionConfirmed = ({
    hash,
    wait
  }) => {
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

  const claimRewards = async () => {
    initTransaction()
    dowsJSConnector.dowsJs.FeePool.claimFees()
      .then(onTransactionConfirmed)
      .catch(onTransactionException)
  }

  return (
    <div className="reward">
      <div className="reward-title">
        <span>{t('reward.title')}</span>
        <span>{t('reward.text')}</span>
      </div>
      <div className="reward-content">
        <div className="reward-input">
          <div className="label">
            {t('reward.transactionReward')}
          </div>
          <span className="value">
            {tradingReward ?? <LoadingOutlined />}
          </span>
        </div>
        <div className="reward-input">
          <div className="label">
            {t('reward.syntheticReward')}
          </div>
          <span className="value">
            {syntheticReward ?? <LoadingOutlined />}
          </span>
        </div>
        <div className="reward-content-bottom">
          <span>{t('reward.bottomText')}</span>
        </div>
      </div>
      <div className="reward-bottom">
        <Button
          disabled={
            claimRewardDisabled ||
            transaction.toBeConfirmed
          }
          onClick={claimRewards}
        >
          {t('reward.receive')}
        </Button>
        <GasPrice />
        <TransactionInProgress
          {...transaction}
          content={t('transactionStatus.transactionType.reward')}
        />
        <TransactionCompleted
          {...transaction}
          content={t('transactionStatus.transactionType.reward')}
        />
        <div className="error-message">
          {transaction.error && transaction.error.message}
        </div>
      </div>
    </div>
  )
}

export default Reward
