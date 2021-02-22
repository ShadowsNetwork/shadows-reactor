import React from 'react'
import '../../styles/synthesis.css'
import '../../styles/dropDown.css'
import { Button } from 'antd'
import { formatMessage } from 'umi'

// const menu = (
//   <Menu>
//     <Menu.Item>
//       <span
//         style={{
//           display: 'inline-block',
//           width: '15px',
//           height: '15px',
//           borderRadius: '15px',
//           background: '#4444FF',
//         }}
//       />
//       <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>
//         xUSD
//       </span>
//     </Menu.Item>
//     <Menu.Item>
//       <span
//         style={{
//           display: 'inline-block',
//           width: '15px',
//           height: '15px',
//           borderRadius: '15px',
//           background: '#03AF91',
//         }}
//       />
//       <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>
//         xETC
//       </span>
//     </Menu.Item>
//     <Menu.Item>
//       <span
//         style={{
//           display: 'inline-block',
//           width: '15px',
//           height: '15px',
//           borderRadius: '15px',
//           background: '#D2417E',
//         }}
//       />
//       <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>
//         xUSD
//       </span>
//     </Menu.Item>
//     <Menu.Item>
//       <span
//         style={{
//           display: 'inline-block',
//           width: '15px',
//           height: '15px',
//           borderRadius: '15px',
//           background: '#464146',
//         }}
//       />
//       <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>
//         DOWS
//       </span>
//     </Menu.Item>
//   </Menu>
// )
function Synthesis() {
  return (
    <div className="bg">
      <div className="Synthesis">
        <div className="Synthesis-title">
          <span>{formatMessage({ id: 'synthesis.title' })}</span>
          <span>{formatMessage({ id: 'synthesis.text' })}</span>
        </div>
        <div className="Synthesis-content">
          <div className="Synthesis-content-title">
            <span>
              {formatMessage({ id: 'balance' })}
              ：
            </span>
            <span>20 DOWS</span>
          </div>
          <div className="Synthesis-input">
            {/* <Dropdown overlay={menu} placement="bottomLeft"> */}
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
            {/* </Dropdown> */}
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
            <div className="all" style={{ position: 'absolute', right: '15px', fontSize: '8pt' }}>
              {formatMessage({ id: 'all' })}
            </div>
          </div>
          <div className="Synthesis-content-bottom">
            <span>Staking：00 DOWS</span>
            <span>
              {formatMessage({ id: 'synthesis.debtRatio' })}
              ：0.0%
            </span>
          </div>
        </div>
        <div className="Synthesis-bottom">
          <Button>{formatMessage({ id: 'synthesis.start' })}</Button>
          <span>
            {formatMessage({ id: 'networkFee' })}
            ：$0 / 90 GWEI
          </span>
          <span>
            <i />
          </span>
        </div>
      </div>
    </div>
  )
}

export default Synthesis