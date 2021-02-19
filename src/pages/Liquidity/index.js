import React from 'react'
import '../../styles/flow.css'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Liquidity() {
  const { t } = useTranslation()

  return (
    <div className="flow">
      <div className="flow-title">
        <span>{t('liquidity.title')}</span>
        <span>{t('liquidity.text')}</span>
      </div>
      <div className="flow-content">
        <Link to="/FlowStep" className="flow-content-main">
          <span>iBTC</span>
          <span>iBTC</span>
          <span>weekly rewards</span>
          <span>18000 DOWS</span>
        </Link>
        <Link to="/FlowStep" className="flow-content-main">
          <span>xETH</span>
          <span>xETH</span>
          <span>weekly rewards</span>
          <span>8000 DOWS</span>
        </Link>
        <Link to="/FlowStep" className="flow-content-main">
          <span>xETH</span>
          <span>xETH</span>
          <span>weekly rewards</span>
          <span>8000 DOWS</span>
        </Link>
      </div>
    </div>
  )
}

export default Liquidity
