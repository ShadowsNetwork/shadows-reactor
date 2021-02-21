import React from 'react'
import { useTranslation } from 'react-i18next'
import '../../styles/completion.css'

function Completion(props) {
  const { t } = useTranslation()

  const { amount, destinationAccount, txHash } = props

  return (
    <div className="completion">
      <div className="completion-title">
        <span>{t('transfer.completion.title')}</span>
        <span>{t('transfer.completion.text')}</span>
      </div>
      <div className="completion-content">
        <div className="amount">
          <span>{t('transfer.confirmation.amount')}</span>
          <span>{amount}</span>
        </div>
        <div className="address">
          <span>{t('transfer.confirmation.account')}</span>
          <span>{destinationAccount}</span>
        </div>
        <div className="hash">
          <span>{t('transfer.completion.txHash')}</span>
          <span>{txHash}</span>
        </div>
      </div>
    </div>
  )
}

export default Completion
