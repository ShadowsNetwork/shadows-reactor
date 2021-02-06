import React from 'react';
import { Carousel } from 'antd';
import './css/MenuLay.css'
import {
  RightCircleOutlined
}from '@ant-design/icons'



class MenuLay extends React.Component {
  render() {
    return (
      <div className="swiper">
        <Carousel effect="fade" style={{width:"40%",height:"600px",position: "absolute",top:"calc((100% - 600px) / 2)",left: "30%"}}>
          <div className="menuLay">
            <span>Risk Warning</span>
            <span>风险提示</span>
            <span>抵押DOS合成资产时，会产生一笔”债务“，”债务“是他们初始铸造的xUSD数量，
              接下来，债务将随 着其他合成资产持有人的收益和损失而波动。当有人持有的合成资
              产增值时，那部分收益将按比例来 自于所有DOS持有人的债务。每个持有人都必须付
              清他们的债务才能解锁他们质押的DOS。</span>
            {/*<img src={explainone}/>*/}
          </div>
          <div className="menuLay">
            <span>Mortgage DOS reward</span>
            <span>抵押DOS奖励</span>
            <span className="mortgage">DOS抵押人可以获得3种奖励：
              1.交易所手续费奖励；2.Stakling奖励；3.借贷池收益</span>
            {/*<img src={explainone}/>*/}
          </div>
          <div className="menuLay">
            <span>80% mortgage rate</span>
            <span>80%抵押率</span>
            <span>所有合成资产都由抵押的DOS来支撑其价值，抵押率最低要求为80%，
              低于抵押率要求时将无法获得奖励和赎DOS，满足抵押率每周即可领取多种奖励、</span>
            {/*<img src={explainone}/>*/}
          </div>
          <div>
            <h3>4</h3>
          </div>
        </Carousel>
      </div>
    )
  }
}

ReactDOM.render(
  <RightCircleOutlined/>,
  document.getElementsByClassName("swiper")
)

export default MenuLay
