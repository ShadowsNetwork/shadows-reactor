import React, { useState } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import './index.less'
import { Button } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

interface TransactionCompletedProps extends WithTranslation {
  content: string | null;
  hash: string | null;
  success: boolean
}

const TransactionCompleted: React.FC<TransactionCompletedProps> = ({
  t,
  content,
  hash,
  success
}) => {
  const [closed, setClosed] = useState<boolean>(false)

  return success && !closed ? (
    <div className="transaction-completed">
      <CheckOutlined
        style={{
          fontSize: '2.4rem',
          color: 'white'
        }}
      />
      <span className="title">
        {t('transaction.completed.title')}
      </span>
      <span className="content">
        {content}
      </span>
      <Button
        onClick={() => {
          window.open(`https://kovan.etherscan.io/tx/${hash}`)
        }}
      >
        {t('transaction.completed.view')}
      </Button>
      <Button
        onClick={() => setClosed(true)}
      >
        {t('transaction.completed.close')}
      </Button>
    </div>
  ) : (<></>)
}

export default withTranslation()(TransactionCompleted)
