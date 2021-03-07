import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { withTranslation } from 'react-i18next'
import './index.less'
import TransactionStatusProps from '@/components/TransactionStatus/props'

const TransactionFailed: React.FC<TransactionStatusProps> = ({
  t,
  content,
}) => {
  return (
    <>
      <div className="transaction-failed">
        <CloseOutlined
          style={{
            fontSize: '2.4rem',
            color: 'white',
            marginTop: '0.9rem'
          }}
        />
      </div>
      <div className="text">
        <span className="title">
          {t('transactionStatus.title.failed')}
        </span>
        <span className="content">
          {content}
        </span>
      </div>
    </>
  )
}

export default withTranslation()(TransactionFailed)
