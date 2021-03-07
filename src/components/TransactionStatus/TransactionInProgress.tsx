import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { withTranslation } from 'react-i18next'
import './index.less'
import TransactionStatusProps from '@/components/TransactionStatus/props'

const TransactionInProgress: React.FC<TransactionStatusProps> = ({
  t,
  content,
}) => {
  return (
    <>
      <LoadingOutlined
        style={{
          fontSize: '4.5rem',
          color: 'white',
          marginLeft: '2rem'
        }}
      />
      <div className="text">
        <span className="title">
          {t('transactionStatus.title.inProgress')}
        </span>
        <span className="content">
          {content}
        </span>
      </div>
    </>
  )
}

export default withTranslation()(TransactionInProgress)
