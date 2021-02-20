import React from 'react'
import { useTranslation } from 'react-i18next'

function Completion(props) {
  const { t } = useTranslation()

  const { amount, destinationAccount, txHash } = props

  return (
    <div className="transaction">
      <div className="transaction-title">
        <span>{t('transfer.completion.title')}</span>
        <span>{t('transfer.completion.text')}</span>
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
        <div>
          <span>{t('transfer.completion.txHash')}</span>
          <span>{txHash}</span>
        </div>
      </div>
    </div>
  )
}

export default Completion
