import React from 'react'
import { useTranslation } from 'react-i18next'
import './index.less'
import { Button } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

const TransactionCompleted = props => {
  const { t } = useTranslation()
  const { content, hash } = props
  return (
    <div className="transaction-completed">
      <CheckOutlined style={{ fontSize: '2.4rem', color: 'white' }} />
      <span className="title">{t('transaction.completed.title')}</span>
      <span className="content">{content}</span>
      <Button onClick={() => { window.open(`https://kovan.etherscan.io/tx/${hash}`) }}>
        {t('transaction.completed.view')}
      </Button>
      <Button>
        {t('transaction.completed.close')}
      </Button>
    </div>
  )
}

export default TransactionCompleted
