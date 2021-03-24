import React from 'react'
import { Carousel } from 'antd'
import './index.less'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import risk from '@/img/risk.png'
import mortgage from '@/img/mortgage.png'
import mortgageRate from '@/img/mortgageRate.png'

const MenuLay = () => {
  let slider

  const { t } = useTranslation()
  return (
    <div className="swiper">
      <Carousel
        effect="fade"
        ref={el => {
          slider = el
        }}
        style={{
          width: '46%',
          height: '600px',
          position: 'absolute',
          top: 'calc((100% - 600px) / 2)',
          left: '27%'
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
      <div
        onClick={() => {
          slider.prev()
        }}
        className="leftClick"
      >
        <LeftOutlined style={{ fontSize: '22px' }} />
      </div>
      <div
        onClick={() => {
          slider.next()
        }}
        className="rightClick"
      >
        <RightOutlined style={{ fontSize: '22px' }} />
      </div>
    </div>
  )
}

export default MenuLay
