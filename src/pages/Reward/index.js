import React from 'react'
import '../../styles/reward.css'
import '../../styles/dropDown.css'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import GasPrice from '@/components/GasPrice'

function Reward() {
  const { t } = useTranslation()

  return (
    <div className="reward">
      <div className="reward-title">
        <span>{t('reward.title')}</span>
        <span>{t('reward.text')}</span>
      </div>
      <div className="reward-content">
        <div className="reward-input">
          <Button
            style={{
              height: '43px',
              background: 'none',
              border: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                marginLeft: '10px',
                color: '#B9B1B7',
                fontSize: '8pt',
              }}
            >
              {t('reward.transactionReward')}
            </span>
          </Button>
          <input
            style={{
              width: '60%',
              height: '43px',
              background: 'none',
              border: 0,
              outline: 'none',
              color: '#fff',
            }}
          />
          <span className="all" style={{ position: 'absolute', right: '15px', fontSize: '8pt' }}>
            0.00
          </span>
        </div>
        <div className="reward-input">
          <Button
            style={{
              height: '43px',
              background: 'none',
              border: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                marginLeft: '10px',
                color: '#B9B1B7',
                fontSize: '8pt',
              }}
            >
              {t('reward.syntheticReward')}
            </span>
          </Button>
          <input
            style={{
              width: '60%',
              height: '43px',
              background: 'none',
              border: 0,
              outline: 'none',
              color: '#fff',
            }}
          />
          <span className="all" style={{ position: 'absolute', right: '15px', fontSize: '8pt' }}>
            0.00
          </span>
        </div>
        <div className="reward-content-bottom">
          <span>{t('reward.bottomText')}</span>
        </div>
      </div>
      <div className="reward-bottom">
        <Button>{t('reward.receive')}</Button>
        <GasPrice />
      </div>
    </div>
  )
}

export default Reward
