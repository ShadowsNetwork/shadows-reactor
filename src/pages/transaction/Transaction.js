import React from 'react'
import { Button, Dropdown, Menu } from 'antd'
import '@/styles/transaction.css'
import '@/styles/dropDown.css'
import { formatMessage } from 'umi'
import useEthGasPriceQuery from '@/web3/useEthGasPriceQuery'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useTranslation } from 'react-i18next'

const queryClient = new QueryClient()

const menu = (
  <Menu>
    <Menu.Item>
      <span
        style={{
          display: 'inline-block',
          width: '15px',
          height: '15px',
          borderRadius: '15px',
          background: '#4444FF',
        }}
      />
      <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>xUSD</span>
    </Menu.Item>
    <Menu.Item>
      <span
        style={{
          display: 'inline-block',
          width: '15px',
          height: '15px',
          borderRadius: '15px',
          background: '#03AF91',
        }}
      />
      <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>xETC</span>
    </Menu.Item>
    <Menu.Item>
      <span
        style={{
          display: 'inline-block',
          width: '15px',
          height: '15px',
          borderRadius: '15px',
          background: '#D2417E',
        }}
      />
      <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>xJPY</span>
    </Menu.Item>
    <Menu.Item>
      <span
        style={{
          display: 'inline-block',
          width: '15px',
          height: '15px',
          borderRadius: '15px',
          background: '#464146',
        }}
      />
      <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>xEUR</span>
    </Menu.Item>
  </Menu>
)

function Transaction() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="transaction">
        <div className="transaction-title">
          <span>{formatMessage({ id: 'transaction.title' })}</span>
          <span>{formatMessage({ id: 'transaction.text' })}</span>
        </div>
        <div className="transaction-content">
          <div className="transaction-content-title">
            <span>{formatMessage({ id: 'transaction.pay' })}</span>
            <span>
              {formatMessage({ id: 'transaction.available' })}
              ：0
            </span>
          </div>
          <div className="transaction-input">
            <Dropdown overlay={menu} placement="bottomLeft">
              <Button
                style={{
                  height: '43px',
                  background: 'none',
                  border: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '15px',
                    background: '#4444FF',
                  }}
                />
                <span
                  style={{
                    marginLeft: '10px',
                    color: '#B9B1B7',
                    fontSize: '8pt',
                  }}
                >
                  xUSD
                </span>
              </Button>
            </Dropdown>
            <input
              style={{
                width: '60%',
                height: '43px',
                background: 'none',
                border: 0,
                outline: 'none',
                color: '#fff',
              }}
            />
            <span className="all" style={{ position: 'absolute', right: '15px', fontSize: '8pt' }}>
              {formatMessage({ id: 'all' })}
            </span>
          </div>
          <div className="transaction-content">
            <div className="transaction-content-title">
              <span>{formatMessage({ id: 'transaction.receive' })}</span>
              <span>{formatMessage({ id: 'transaction.estimated' })}</span>
            </div>
            <div className="transaction-input">
              <Dropdown overlay={menu} placement="bottomLeft">
                <Button
                  style={{
                    height: '43px',
                    background: 'none',
                    border: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '15px',
                      height: '15px',
                      borderRadius: '15px',
                      background: '#4444FF',
                    }}
                  />
                  <span
                    style={{
                      marginLeft: '10px',
                      color: '#B9B1B7',
                      fontSize: '8pt',
                    }}
                  >
                    xUSD
                  </span>
                </Button>
              </Dropdown>
              <input
                style={{
                  width: '60%',
                  height: '43px',
                  background: 'none',
                  border: 0,
                  outline: 'none',
                  color: '#fff',
                }}
              />
              <span className="all" style={{ position: 'absolute', right: '15px', fontSize: '8pt' }}>
                {formatMessage({ id: 'all' })}
              </span>
            </div>
          </div>
          <div className="transaction-content-bottom">
            <span>
              {formatMessage({ id: 'transaction.fees' })}
              ：0.3%
            </span>
          </div>
        </div>
        <NetworkFee />
      </div>
    </QueryClientProvider>
  )
}

function NetworkFee() {
  const ethGasPriceQuery = useEthGasPriceQuery()
  const { data } = ethGasPriceQuery

  const { t } = useTranslation()
  if (data) {
    const { fastest, fast, average } = data
    return (
      <div className="transaction-bottom">
        <Button>{formatMessage({ id: 'transaction' })}</Button>
        <span>
          {formatMessage({ id: 'networkFee' })}
          { `：$0 / ${fast} GWEI` }
        </span>
        <span style={{ marginLeft: '5px' }}>{t('transaction.networkPrice.edit')}</span>
      </div>
    )
  }
  return (
    <>
      <span />
    </>
  )
}

export default Transaction
