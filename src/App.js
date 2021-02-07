import React from 'react';
import { Menu,Dropdown, Button} from 'antd';
import {BrowserRouter as Router , Link, Route} from 'react-router-dom'
import {
  UserOutlined,
  PartitionOutlined,
  InteractionOutlined,
  RestOutlined,
  GiftOutlined,
  UndoOutlined,
  PaperClipOutlined,
  GlobalOutlined,
  DownCircleFilled
} from '@ant-design/icons';
import './App.css';
import MenuLay from "./MenuLay";
import Personal from "./Personal"
import Synthesis from "./Synthesis";
import Transaction from "./Transaction";
import Flow from "./flow/Flow"
import Destruction from "./Destruction";
import Reward from "./Reward";
import Success from "./Success";
import Error from "./Error";
import logoURL from "./img/logotext.png"
import logoImg from "./img/logoImg.png"
import './css/languageDropDown.css'
import FlowStep from "./flow/FlowStep";


function LogoText() {
  return (
    <img src={logoURL} style={{width:"140px",marginTop:"30px",marginBottom:"30px",marginLeft:"20px"}}/>
  )
}

function LogoImg() {
  return (
    <img src={logoImg}  style={{width:"30px",marginTop:"20px",marginLeft:"15px",marginBottom:"20px"}}/>
  )
}
class LogoSet extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.collapsed){
      return(
        <LogoImg/>
      )
    }else {
      return (
        <LogoText/>
      )
    }
  }
}
const menu = (
  <Menu>
    <Menu.Item>
      <span style={{display:"inline-block",width:"15px",height:"15px",borderRadius:"15px",background:"#4444FF"}}/>
      <span style={{marginLeft:"10px",color:"#B9B1B7",fontSize:"8pt"}}>Chinese</span>
    </Menu.Item>
    <Menu.Item>
      <span style={{display:"inline-block",width:"15px",height:"15px",borderRadius:"15px",background:"#03AF91"}}/>
      <span style={{marginLeft:"10px",color:"#B9B1B7",fontSize:"8pt"}}>English</span>
    </Menu.Item>
    <Menu.Item>
      <span style={{display:"inline-block",width:"15px",height:"15px",borderRadius:"15px",background:"#D2417E"}}/>
      <span style={{marginLeft:"10px",color:"#B9B1B7",fontSize:"8pt"}}>French</span>
    </Menu.Item>
  </Menu>
);

class App extends React.Component {
  state = {
    collapsed: false,
    logoURL: logoURL
  };

  openMenu=()=>{
    this.setState({
      collapsed : false
    })
  }
  closeMenu=()=>{
    this.setState({
      collapsed: true
    })
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div style={{ width: 256 }}>
            <Menu
              defaultSelectedKeys={['Personal']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              theme="dark"
              onMouseEnter={this.openMenu}
              onMouseLeave={this.closeMenu}
              inlineCollapsed={this.state.collapsed}
            >
              <Link to='/'><LogoSet collapsed={this.state.collapsed}/></Link>
              <Menu.Item key="Personal" icon={<UserOutlined />}>
                <Link to="/Personal">个人信息</Link>
              </Menu.Item>
              <Menu.Item key="Synthesis" icon={<PartitionOutlined />}>
                <Link to="/Synthesis">合成</Link>
              </Menu.Item>
              <Menu.Item key="Transaction" icon={<InteractionOutlined />}>
                <Link to="/Transaction">交易</Link>
              </Menu.Item>
              <Menu.Item key="flow" icon={<UndoOutlined />}>
                <Link to="/Flow">流动性</Link>
              </Menu.Item>
              <Menu.Item key="4" icon={<RestOutlined />}>
                <Link to="/Destruction">销毁</Link>
              </Menu.Item>
              <Menu.Item key="5" icon={<GiftOutlined />}>
                <Link to="Reward">奖励</Link>
              </Menu.Item>
            </Menu>
          </div>
          <Route path='/' exact component={MenuLay}/>
          <Route path='/Personal' exact component={Personal}/>
          <Route path='/Synthesis' exact component={Synthesis}/>
          <Route path='/Transaction' exact component={Transaction}/>
          <Route path='/Flow' exact component={Flow}/>
          <Route path='/Destruction' exact component={Destruction}/>
          <Route path='/Reward' exact component={Reward}/>
          <Route path='/Success' exact component={Success}/>
          <Route path='/Error' exact component={Error}/>
        </Router>
        <Dropdown overlay={menu} placement="bottomLeft" arrow>
          <div className="language">
            <GlobalOutlined style={{ fontSize: '16px', color: '#fff' }}/>
            <span style={{marginLeft:"5px"}}>中/CN</span>
            <div>v</div>
          </div>
        </Dropdown>
        <div className="money">
          <PaperClipOutlined style={{ fontSize: '16px', color: '#fff' }}/>
          <span style={{marginLeft:"5px"}}>链接钱包</span>
        </div>
      </div>
    );
  }
}

export default App;
