import React from 'react'
import { Button, Dropdown, Menu } from 'antd'
import '../../styles/transaction.css'
import '../../styles/dropDown.css'

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
      <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>
        xUSD
      </span>
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
      <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>
        xETC
      </span>
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
      <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>
        xJPY
      </span>
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
      <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>
        xEUR
      </span>
    </Menu.Item>
  </Menu>
)

class Transaction extends React.Component {
  render() {
    return (
      <div className="transaction">
        <div className="transaction-title">
          <span>交易</span>
          <span>
            交易您的合成资产和xUSD。
          </span>
        </div>
        <div className="transaction-content">
          <div className="transaction-content-title">
            <span>支付</span>
            <span>可用：0</span>
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
            <span
              className="all"
              style={{ position: 'absolute', right: '15px', fontSize: '8pt' }}
            >
              全部
            </span>
          </div>
          <div className="transaction-content">
            <div className="transaction-content-title">
              <span>接收</span>
              <span>估计的</span>
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
              <span
                className="all"
                style={{ position: 'absolute', right: '15px', fontSize: '8pt' }}
              >
                全部
              </span>
            </div>
          </div>
          <div className="transaction-content-bottom">
            <span>交易手续费：0.3%</span>
          </div>
        </div>
        <div className="transaction-bottom">
          <Button>交易</Button>
          <span>网络费用：$0 / 90 GWEI</span>
        </div>
      </div>
    )
  }
}

export default Transaction
