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
import MenuLay from "./views/menuLay/MenuLay";
import Personal from "./views/personal/Personal"
import Synthesis from "./views/synthesis/Synthesis";
import Transaction from "./views/transaction/Transaction";
import Flow from "./views/flow/Flow"
import FlowStep from "./views/flow/FlowStep";
import Destruction from "./views/Destruction/Destruction";
import Reward from "./views/reward/Reward";
import Success from "./views/Success";
import Error from "./views/Error";
import Language from "./views/Language";
import logoURL from "./img/logotext.png"
import logoImg from "./img/logoImg.png"



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
          <Route path='/Flow' component={Flow}/>
          <Route path='/Destruction' exact component={Destruction}/>
          <Route path='/Reward' exact component={Reward}/>
          <Route path='/Success' exact component={Success}/>
          <Route path='/Error' exact component={Error}/>
          <Route path='/FlowStep' exact component={FlowStep}/>
        </Router>
        <div className="money">
          <PaperClipOutlined style={{ fontSize: '16px', color: '#fff' }}/>
          <span style={{marginLeft:"5px"}}>链接钱包</span>
        </div>
        <Language/>
      </div>
    );
  }
}

export default App;
