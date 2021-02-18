import React from 'react'
import '../../styles/reward.css'
import '../../styles/dropDown.css'
import { Button } from 'antd'
import { formatMessage } from 'umi'

function Reward() {
  return (
    <div className="reward">
      <div className="reward-title">
        <span>{formatMessage({ id: 'reward.title' })}</span>
        <span>{formatMessage({ id: 'reward.text' })}</span>
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
              {formatMessage({ id: 'reward.transactionReward' })}
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
          <span className="all" style={{ position: 'absolute', right: '15px', fontSize: '8pt' }}>
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
              {formatMessage({ id: 'reward.syntheticReward' })}
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
          <span className="all" style={{ position: 'absolute', right: '15px', fontSize: '8pt' }}>
            0.00
          </span>
        </div>
        <div className="reward-content-bottom">
          <span>{formatMessage({ id: 'reward.bottomText' })}</span>
        </div>
      </div>
      <div className="reward-bottom">
        <Button>{formatMessage({ id: 'reward.receive' })}</Button>
        <span>
          {formatMessage({ id: 'reward.networkFee' })}
          ：$0 / 90 GWEI
        </span>
      </div>
    </div>
  )
}

export default Reward
