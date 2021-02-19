import React from 'react'
import '../../styles/personal.css'
import { Progress } from 'antd'
import { useTranslation } from 'react-i18next'

function Personal() {
  const { t } = useTranslation()

  return (
    <div className="me">
      <div className="personal-title">
        <span>Personal information</span>
        <span>{t('person.title')}</span>
      </div>
      <div className="personal-content">
        <div className="usd">
          <div>
            <span>xUSD</span>
            <span>100000.00</span>
          </div>
          <div>
            <span>xEUR</span>
            <span>100.00</span>
          </div>
          <div>
            <span>xJPY</span>
            <span>100.00</span>
          </div>
          <div>
            <span>xAUD</span>
            <span>100.00</span>
          </div>
        </div>
        <div className="mortgage">
          <div>
            <span>{t('person.myRate')}</span>
            <span>810%</span>
          </div>
          <div>
            <span>{t('person.targetRate')}</span>
            <span>800%</span>
          </div>
        </div>
      </div>
      <div className="snk">
        <span>
          {t('person.dows')}
          {' '}
          DOWS
        </span>
        <span>150000 DOWS</span>
      </div>
      <div className="hr" />
      <div className="progressBar">
        <div className="progressBar-top">
          <span>
            {t('person.locked')}
            : 150000
          </span>
          <span>
            {t('person.Transferable')}
            : 0
          </span>
        </div>
        <Progress
          percent={50}
          showInfo={false}
          strokeColor="#FF2C63"
          trailColor="#342D33"
          style={{ position: 'relative', top: '20px' }}
        />
      </div>
      <div className="progressBar">
        <div className="progressBar-top">
          <span>Staked: 10000</span>
          <span>NotStaked: 0</span>
        </div>
        <Progress
          percent={50}
          showInfo={false}
          strokeColor="#FF2C63"
          trailColor="#342D33"
          style={{ position: 'relative', top: '20px' }}
        />
      </div>
      <div className="progressBar">
        <div className="progressBar-top">
          <span>Staked: 0</span>
          <span>NotStaked: 0</span>
        </div>
        <Progress
          percent={50}
          showInfo={false}
          strokeColor="#FF2C63"
          trailColor="#342D33"
          style={{ position: 'relative', top: '20px' }}
        />
      </div>
    </div>
  )
}

export default Personal
