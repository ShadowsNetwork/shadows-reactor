import React from 'react'
import TransactionInProgress from './TransactionInProgress'
import TransactionCompleted from './TransactionCompleted'
import TransactionFailed from './TransactionFailed'
import { Button } from 'antd'
import { withTranslation } from 'react-i18next'
import TransactionStatusProps from '@/components/TransactionStatus/props'

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  t,
  content,
  hash,
  error,
  success,
  inProgress,
  closed,
  onClosed
}) => {
  const props = {
    content,
    hash,
    error,
    success,
    inProgress,
    closed,
    onClosed
  }
  return !closed && (inProgress || success || error) ? (
    <div className="transaction-status">
      {inProgress && <TransactionInProgress {...props} />}
      {success && <TransactionCompleted {...props} />}
      {error && <TransactionFailed {...props} />}

      <div className="transaction-btn-group">
        <Button
          className="view-btn"
          onClick={() => {
            window.open(`https://kovan.etherscan.io/tx/${hash}`)
          }}
        >
          {t('transactionStatus.button.view')}
        </Button>
        <Button
          className="close-btn"
          onClick={() => onClosed()}
        >
          {t('transactionStatus.button.close')}
        </Button>
      </div>
    </div>
  ) : (<></>)
}

export default withTranslation()(TransactionStatus)
