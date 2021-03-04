import React, { useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { WithTranslation, withTranslation } from 'react-i18next'
import './index.less'
import { Button } from 'antd'

interface TransactionInProgressProps extends WithTranslation {
  content: string | undefined;
  hash: string | undefined;
  inProgress: boolean;
}

const TransactionInProgress: React.FC<TransactionInProgressProps> = ({
  t,
  content,
  hash,
  inProgress = false
}) => {
  const [closed, setClosed] = useState<boolean>(false)

  return (
    inProgress && !closed ? (
      <div className="transaction-status">
        <LoadingOutlined style={{
          fontSize: '4.5rem',
          color: 'white',
          marginLeft: '2rem'
        }} />
        <div className="text">
          <span className="title">
            {t('transactionStatus.title.inProgress')}
          </span>
          <span className="content">
            {content}
          </span>
        </div>
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
            onClick={() => setClosed(true)}
          >
            {t('transactionStatus.button.close')}
          </Button>
        </div>
      </div>
    ) : (<></>)
  )
}

export default withTranslation()(TransactionInProgress)
