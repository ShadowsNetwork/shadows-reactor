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

function Reward() {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [tradingReward, setTradingReward] = useState('0')
  const [syntheticReward, setSyntheticReward] = useState('0')

  const [claimRewardDisabled, setClaimRewardDisabled] = useState(true)

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
        <Button disabled={claimRewardDisabled}>
          {t('reward.receive')}
        </Button>
        <GasPrice />
      </div>
    </div>
  )
}

export default Reward
