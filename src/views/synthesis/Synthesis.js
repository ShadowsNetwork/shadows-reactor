import React from 'react'
import '../../css/synthesis.css'
import '../../css/dropDown.css'
import { Menu, Dropdown, Button, Space } from 'antd';


const menu = (
  <Menu>
    <Menu.Item>
      <span style={{display:"inline-block",width:"15px",height:"15px",borderRadius:"15px",background:"#4444FF"}}/>
      <span style={{marginLeft:"10px",color:"#B9B1B7",fontSize:"8pt"}}>xUSD</span>
    </Menu.Item>
    <Menu.Item>
      <span style={{display:"inline-block",width:"15px",height:"15px",borderRadius:"15px",background:"#03AF91"}}/>
      <span style={{marginLeft:"10px",color:"#B9B1B7",fontSize:"8pt"}}>sETC</span>
    </Menu.Item>
    <Menu.Item>
      <span style={{display:"inline-block",width:"15px",height:"15px",borderRadius:"15px",background:"#D2417E"}}/>
      <span style={{marginLeft:"10px",color:"#B9B1B7",fontSize:"8pt"}}>sUSD</span>
    </Menu.Item>
    <Menu.Item>
      <span style={{display:"inline-block",width:"15px",height:"15px",borderRadius:"15px",background:"#464146"}}/>
      <span style={{marginLeft:"10px",color:"#B9B1B7",fontSize:"8pt"}}>SNX</span>
    </Menu.Item>
  </Menu>
);
class Synthesis extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div className="bg">
      <div className="Synthesis">
        <div className="Synthesis-title">
          <span>合成</span>
          <span>合成资产满足了我们更多样的需求。对有避险需求的用户而言，相较于美元，
            他们需要区块链上的稳定币（USDT、dUSD、sUSD等等，属于合成资产），
            以便于资金流动；</span>
        </div>
        <div className="Synthesis-content">
          <div className="Synthesis-content-title">
            <span>余额：</span>
            <span>20DOS</span>
          </div>
          <div className="Synthesis-input">
            <Dropdown overlay={menu} placement="bottomLeft">
              <Button style={{height:"43px",background:"none",border:0,display:"flex",alignItems:"center"}}>
                <div style={{width:"15px",height:"15px",borderRadius:"15px",background:"#4444FF"}}/>
                <span style={{marginLeft:"10px",color:"#B9B1B7",fontSize:"8pt"}}>xUSD</span>
              </Button>
            </Dropdown>
            <input style={{width:"60%",height:"43px",background:"none",border:0,outline:"none",color:"#fff"}}/>
            <div className="all" style={{position:"absolute",right:"15px",fontSize:"8pt"}}>全部</div>
          </div>
          <div className="Synthesis-content-bottom">
            <span>Staking：00DOS</span>
            <span>债务比例：0.0%</span>
          </div>
        </div>
        <div className="Synthesis-bottom">
          <Button>开始合成</Button>
          <span>网络费用：$0 / 90 GWEI</span>
          <span>
            <i/>
          </span>
        </div>
      </div>
      </div>
    )
  }
}

export default Synthesis
