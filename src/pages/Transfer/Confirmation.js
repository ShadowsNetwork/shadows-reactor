import React from 'react'
import { useTranslation } from 'react-i18next'
import '../../styles/confirmation.css'

function Confirmation(props) {
  const { t } = useTranslation()

  const { amount, destinationAccount } = props

  return (
    <div className="confirmation">
      <div className="confirmation-title">
        <span>{t('transfer.confirmation.title')}</span>
        <span>{t('transfer.confirmation.text')}</span>
      </div>
      <div className="confirmation-content">
        <div className="amount">
          <span>{t('transfer.confirmation.amount')}</span>
          <span>{amount}</span>
        </div>
        <div className="address">
          <span>{t('transfer.confirmation.account')}</span>
          <span>{destinationAccount}</span>
        </div>
      </div>
    </div>
  )
}

export default Confirmation
