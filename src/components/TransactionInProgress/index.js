import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import './index.less'
import { Button } from 'antd'

const TransactionInProgress = props => {
  const { t } = useTranslation()
  const { content, hash } = props
  return (
    <div className="transaction-in-progress">
      <LoadingOutlined style={{ fontSize: '2.4rem', color: 'white' }} />
      <span className="title">{t('transaction.inProgress.title')}</span>
      <span className="content">{content}</span>
      <Button onClick={() => { window.open(`https://kovan.etherscan.io/tx/${hash}`) }}>
        {t('transaction.inProgress.view')}
      </Button>
      <Button>
        {t('transaction.inProgress.close')}
      </Button>
    </div>
  )
}

export default TransactionInProgress
