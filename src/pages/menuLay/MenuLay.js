import React from 'react'
import { Carousel } from 'antd'
import '../../styles/menuLay.css'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import risk from '../../img/risk.png'
import mortgage from '../../img/mortgage.png'
import mortgageRate from '../../img/mortgageRate.png'

class MenuLay extends React.Component {
  next = () => {
    this.slider.next()
  };
  prev = () => {
    this.slider.prev()
  };
  render() {
    return (
      <div className="swiper">
        <Carousel
          effect="fade"
          ref={(el) => (this.slider = el)}
          style={{
            width: '40%',
            height: '600px',
            position: 'absolute',
            top: 'calc((100% - 600px) / 2)',
            left: '30%',
          }}
        >
          <div className="menuLay">
            <span>Risk Warning</span>
            <span>风险提示</span>
            <span>
              抵押DOWS合成资产时，会产生一笔”债务“，”债务“是他们初始铸造的xUSD数量，
              接下来，债务将随
              着其他合成资产持有人的收益和损失而波动。当有人持有的合成资
              产增值时，那部分收益将按比例来
              自于所有DOWS持有人的债务。每个持有人都必须付
              清他们的债务才能解锁他们质押的DOWS。
            </span>
            <img className="riskOne" src={risk}  alt=""/>
            <img className="riskTwo" src={risk}  alt=""/>
            <img className="riskThree" src={risk}  alt=""/>
          </div>
          <div className="menuLay">
            <span>Mortgage DOWS reward</span>
            <span>抵押DOWS奖励</span>
            <span className="mortgage">
              DOWS抵押人可以获得3种奖励：
              1.交易所手续费奖励；2.Stakling奖励；3.借贷池收益
            </span>
            <img className="mortgageImg" src={mortgage}  alt=""/>
          </div>
          <div className="menuLay">
            <span>800% mortgage rate</span>
            <span>800%抵押率</span>
            <span>
              所有合成资产都由抵押的DOWS来支撑其价值，抵押率最低要求为800%，
              低于抵押率要求时将无法获得奖励和赎DOWS，满足抵押率每周即可领取多种奖励、
            </span>
            <img className="mortgageRate" src={mortgageRate}  alt=""/>
          </div>
          <div className="welcome">
            <span>WELCOME</span>
            <span>欢迎使用</span>
            <span>Shadows Network</span>
            <span>
              Shadows是建立在波卡上的去中心化合成资产发行协议、交易协议、贷款协议。
              这些合成资产的价值由DOWS提供抵押担保。
            </span>
          </div>
        </Carousel>
        <div onClick={this.prev} className="leftClick">
          <LeftOutlined style={{ fontSize: '22px' }} />
        </div>
        {/* <RightCircleOutlined onClick={this.next} style={{fontSize:'40px',color:'#FFFFFF',position:'absolute',bottom:'calc((100% - 580px) / 2)',right:'42%'}}/>*/}
        <div onClick={this.next} className="rightClick">
          <RightOutlined style={{ fontSize: '22px' }} />
        </div>
      </div>
    )
  }
}

export default MenuLay
