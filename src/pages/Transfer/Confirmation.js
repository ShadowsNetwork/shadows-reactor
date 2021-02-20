import React from 'react'
import { useTranslation } from 'react-i18next'

function Confirmation(props) {
  const { t } = useTranslation()

  const { amount, destinationAccount } = props

  return (
    <div className="transaction">
      <div className="transaction-title">
        <span>{t('transfer.confirmation.title')}</span>
        <span>{t('transfer.confirmation.text')}</span>
      </div>
      <div className="transaction-content">
        <div>
          <span>{t('transfer.confirmation.amount')}</span>
          <span>{amount}</span>
        </div>
        <div>
          <span>{t('transfer.confirmation.account')}</span>
          <span>{destinationAccount}</span>
        </div>
      </div>
    </div>
  )
}

export default Confirmation
