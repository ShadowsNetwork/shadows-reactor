import React from 'react'
import '../../styles/destruction.css'
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

function Destruction() {
  return (
    <div className="destruction">
      <div className="destruction-title">
        <span>{formatMessage({ id: 'destroy.title' })}</span>
        <span>{formatMessage({ id: 'destroy.text' })}</span>
      </div>
      <div className="operation">
        <Button>{formatMessage({ id: 'destroy.adjust' })}</Button>
        <Button>{formatMessage({ id: 'destroy.all' })}</Button>
      </div>
      <div className="destruction-content">
        <div className="destruction-content-title">
          <span>
            {formatMessage({ id: 'balance' })}
            ：
          </span>
          <span>20 xUSD</span>
        </div>
        <div className="destruction-input">
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
            placeholder="0.00"
          />
          <span className="all" style={{ position: 'absolute', right: '15px', fontSize: '8pt' }}>
            {formatMessage({ id: 'all' })}
          </span>
        </div>
        <div className="destruction-content">
          <div className="destruction-content-title">
            <span>{formatMessage({ id: 'destroy.quantity' })}</span>
          </div>
          <div className="destruction-input">
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
                DOWS
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
            <span className="all" style={{ position: 'absolute', right: '15px', fontSize: '8pt' }}>
              {formatMessage({ id: 'all' })}
            </span>
          </div>
        </div>
      </div>
      <div className="destruction-bottom">
        <Button>{formatMessage({ id: 'destroy' })}</Button>
        <span>
          {formatMessage({ id: 'networkFee' })}
          ：$0 / 90 GWEI
        </span>
      </div>
    </div>
  )
}

export default Destruction
