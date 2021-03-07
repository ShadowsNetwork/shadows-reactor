import React from 'react'
import { withTranslation } from 'react-i18next'
import './index.less'
import { CheckOutlined } from '@ant-design/icons'
import TransactionStatusProps from '@/components/TransactionStatus/props'

const TransactionCompleted: React.FC<TransactionStatusProps> = ({
  t,
  content,
}) => {
  return (
    <>
      <div className="transaction-success">
        <CheckOutlined
          style={{
            fontSize: '2.4rem',
            color: 'white',
            marginTop: '0.9rem'
          }}
        />
      </div>
      <div className="text">
        <span className="title">
          {t('transactionStatus.title.completed')}
        </span>
        <span className="content">
          {content}
        </span>
      </div>
    </>
  )
}

export default withTranslation()(TransactionCompleted)