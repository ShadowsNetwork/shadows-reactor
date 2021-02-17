import React from 'react'
import '../../styles/reward.css'
import '../../styles/dropDown.css'
import { Button } from 'antd'

class Reward extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="reward">
        <div className="reward-title">
          <span>奖励</span>
          <span>
            抵押DOWS铸造合成资产、交易合成资产，每周可获得奖励
          </span>
        </div>
        <div className="reward-content">
          <div className="reward-input">
            <Button
              style={{
                height: '43px',
                background: 'none',
                border: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  marginLeft: '10px',
                  color: '#B9B1B7',
                  fontSize: '8pt',
                }}
              >
                交易奖励
              </span>
            </Button>
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
              0.00
            </span>
          </div>
          <div className="reward-input">
            <Button
              style={{
                height: '43px',
                background: 'none',
                border: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  marginLeft: '10px',
                  color: '#B9B1B7',
                  fontSize: '8pt',
                }}
              >
                合成奖励
              </span>
            </Button>
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
              0.00
            </span>
          </div>
          <div className="reward-content-bottom">
            <span>
              7天不领取，奖励将被回收至池子里，抵押率不足将无法获得奖励
            </span>
          </div>
        </div>
        <div className="reward-bottom">
          <Button>领取</Button>
          <span>网络费用：$0 / 90 GWEI</span>
        </div>
      </div>
    )
  }
}

export default Reward
