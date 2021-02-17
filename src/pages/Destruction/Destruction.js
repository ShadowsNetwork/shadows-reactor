import React from 'react'
import '../../styles/destruction.css'
import '../../styles/dropDown.css'
import { Menu, Dropdown, Button } from 'antd'

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
        sETC
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
        sUSD
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
        SNX
      </span>
    </Menu.Item>
  </Menu>
)

class Destruction extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="destruction">
        <div className="destruction-title">
          <span>销毁</span>
          <span>
            销毁sUSD来解锁您抵押的SNX。这将增加您的抵押率，并减少您的
            债务，使您能转账未托管的SNX
          </span>
        </div>
        <div className="operation">
          <Button>调整至目标抵押率</Button>
          <Button>全部销毁</Button>
        </div>
        <div className="destruction-content">
          <div className="destruction-content-title">
            <span>余额：</span>
            <span>20DOS</span>
          </div>
          <div className="destruction-input">
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
              placeholder="0.00"
            />
            <span
              className="all"
              style={{ position: 'absolute', right: '15px', fontSize: '8pt' }}
            >
              全部
            </span>
          </div>
          <div className="destruction-content">
            <div className="destruction-content-title">
              <span>可解锁的数量</span>
            </div>
            <div className="destruction-input">
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
        </div>
        <div className="destruction-bottom">
          <Button>销毁</Button>
          <span>网络费用：$0 / 90 GWEI</span>
        </div>
      </div>
    )
  }
}

export default Destruction
