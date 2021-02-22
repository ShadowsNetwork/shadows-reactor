import React from 'react'
import '../../styles/synthesis.css'
import '../../styles/dropDown.css'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import GasPrice from '@/components/GasPrice'

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
  const { t } = useTranslation()

  return (
    <div className="bg">
      <div className="Synthesis">
        <div className="Synthesis-title">
          <span>{t('synthesis.title')}</span>
          <span>{t('synthesis.text')}</span>
        </div>
        <div className="Synthesis-content">
          <div className="Synthesis-content-title">
            <span>
              {t('synthesis.balance')}
              ：
            </span>
            <span>20 DOWS</span>
          </div>
          <div className="Synthesis-input">
            {/* <Dropdown overlay={menu} placement="bottomLeft"> */}
            <Button
              style={{
                height: '4.3rem',
                background: 'none',
                border: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '1.5rem',
                  background: '#4444FF',
                }}
              />
              <span
                style={{
                  marginLeft: '1rem',
                  color: '#B9B1B7',
                  fontSize: '1.6rem',
                }}
              >
                DOWS
              </span>
            </Button>
            {/* </Dropdown> */}
            <input
              style={{
                width: '60%',
                height: '4.3rem',
                background: 'none',
                border: 0,
                outline: 'none',
                color: '#fff',
              }}
            />
            <div className="all" style={{ position: 'absolute', right: '1.5rem', fontSize: '1.6rem' }}>
              {t('synthesis.all')}
            </div>
          </div>
          <div className="Synthesis-content-bottom">
            <span>Staking：00 DOWS</span>
            <span>
              {t('synthesis.debtRatio')}
              ：0.0%
            </span>
          </div>
        </div>
        <div className="Synthesis-bottom">
          <Button>{t('synthesis.start')}</Button>
          <GasPrice />
        </div>
      </div>
    </div>
  )
}

export default Synthesis
