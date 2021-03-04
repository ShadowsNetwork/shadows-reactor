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
      <div className="transaction-in-progress">
        <LoadingOutlined style={{
          fontSize: '2.4rem',
          color: 'white'
        }} />
        <span className="title">
          {t('transaction.inProgress.title')}
        </span>
        <span className="content">
          {content}
        </span>
        <Button
          onClick={() => {
            window.open(`https://kovan.etherscan.io/tx/${hash}`)
          }}
        >
          {t('transaction.inProgress.view')}
        </Button>
        <Button
          onClick={() => setClosed(true)}
        >
          {t('transaction.inProgress.close')}
        </Button>
      </div>
    ) : (<></>)
  )
}

export default withTranslation()(TransactionInProgress)
