import React from 'react'
import '../../styles/destruction.css'
import '../../styles/dropDown.css'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <div className="destruction">
      <div className="destruction-title">
        <span>{t('destroy.title')}</span>
        <span>{t('destroy.text')}</span>
      </div>
      <div className="operation">
        <Button>{t('destroy.adjust')}</Button>
        <Button>{t('destroy.all')}</Button>
      </div>
      <div className="destruction-content">
        <div className="destruction-content-title">
          <span>
            {t('destroy.balance')}
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
            {t('destroy.destroyAll')}
          </span>
        </div>
        <div className="destruction-content">
          <div className="destruction-content-title">
            <span>{t('destroy.quantity')}</span>
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
              {t('destroy.all')}
            </span>
          </div>
        </div>
      </div>
      <div className="destruction-bottom">
        <Button>{t('destroy.destroyAll')}</Button>
        <span>
          {t('destroy.networkPrice')}
          {/* TODO */}
          ：$0 / 90 GWEI
        </span>
      </div>
    </div>
  )
}

export default Destruction
