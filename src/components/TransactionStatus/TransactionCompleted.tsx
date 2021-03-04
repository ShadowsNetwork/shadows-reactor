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
    <div className="transaction-status">
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
}

export default withTranslation()(TransactionCompleted)
