import React from 'react'
import '../../css/personal.css'
import { Progress } from 'antd';

class Personal extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div className="me">
        <div className="personal-title">
          <span>Personal information</span>
          <span>个人信息</span>
        </div>
        <div className="personal-content">
          <div className="usd">
            <div>
              <span>xUSD</span>
              <span>00000000</span>
            </div>
            <div>
              <span>xUSD</span>
              <span>00000000</span>
            </div>
            <div>
              <span>xUSD</span>
              <span>00000000</span>
            </div>
            <div>
              <span>xUSD</span>
              <span>00000000</span>
            </div>
          </div>
          <div className="mortgage">
            <div>
              <span>我的抵押率</span>
              <span>50%</span>
            </div>
            <div>
              <span>目标抵押率</span>
              <span>50%</span>
            </div>
          </div>
        </div>
        <div className="snk">
          <span>总SNK</span>
          <span>50%</span>
        </div>
        <div className="hr" />
        <div className="progressBar">
          <div className="progressBar-top">
            <span>已锁定：0</span>
            <span>可转账：0</span>
          </div>
          <Progress percent={50} showInfo={false} strokeColor="#FF2C63" trailColor="#342D33" style={{position: "relative",top:"20px"}}/>
        </div>
        <div className="progressBar">
          <div className="progressBar-top">
            <span>myself.Staked:0</span>
            <span>myself.NotStaked：0</span>
          </div>
          <Progress percent={50} showInfo={false} strokeColor="#FF2C63" trailColor="#342D33" style={{position: "relative",top:"20px"}}/>
        </div>
        <div className="progressBar">
          <div className="progressBar-top">
            <span>myself.Staked:0</span>
            <span>myself.NotStaked：0</span>
          </div>
          <Progress percent={50} showInfo={false} strokeColor="#FF2C63" trailColor="#342D33" style={{position: "relative",top:"20px"}}/>
        </div>
      </div>
    )
  }
}


export default Personal
