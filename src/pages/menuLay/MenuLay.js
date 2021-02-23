import React from 'react'
import { Carousel } from 'antd'
import '../../styles/menuLay.css'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import risk from '../../img/risk.png'
import mortgage from '../../img/mortgage.png'
import mortgageRate from '../../img/mortgageRate.png'

function MenuLay() {
  // eslint-disable-next-line no-unused-vars
  const next = () => {
    // eslint-disable-next-line no-use-before-define
    slider.next()
  }

  const prev = () => {
    // eslint-disable-next-line react/no-this-in-sfc,no-use-before-define
    slider.prev()
  }
  const { t } = useTranslation()
  let slider
  return (
    <div className="swiper">
      <Carousel
        effect="fade"
        ref={(el) => (slider = el)}
        style={{
          width: '46%',
          height: '600px',
          position: 'absolute',
          top: 'calc((100% - 600px) / 2)',
          left: '27%',
        }}
      >
        <div className="menuLay">
          <span>Risk Warning</span>
          <span>{t('risk.title')}</span>
          <span>
            {t('risk.text')}
          </span>
          <img className="riskOne" src={risk} alt="" />
          <img className="riskTwo" src={risk} alt="" />
          <img className="riskThree" src={risk} alt="" />
        </div>
        <div className="menuLay">
          <span>Staking Rewards</span>
          <span>{t('mortgage.title')}</span>
          <span className="mortgage" style={{ textAlign: 'center' }}>
            {t('mortgage.text')}
          </span>
          <img className="mortgageImg" src={mortgage} alt="" />
        </div>
        <div className="menuLay">
          <span>Collateralization Ratio</span>
          <span>{t('rate.title')}</span>
          <span>
            {t('rate.text')}
          </span>
          <img className="mortgageRate" src={mortgageRate} alt="" />
        </div>
        <div className="welcome">
          <span>WELCOME</span>
          <span>{t('welcome.title')}</span>
          <span>Shadows Network</span>
          <span>
            {t('welcome.text')}
          </span>
        </div>
      </Carousel>
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={prev} className="leftClick">
        <LeftOutlined style={{ fontSize: '22px' }} />
      </div>
      {/* <RightCircleOutlined onClick={this.next} style={{fontSize:'40px',color:'#FFFFFF',
        position:'absolute',bottom:'calc((100% - 580px) / 2)',right:'42%'}}/> */}
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={next} className="rightClick">
        <RightOutlined style={{ fontSize: '22px' }} />
      </div>
    </div>
  )
}

export default MenuLay
