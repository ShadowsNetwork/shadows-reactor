// import styles from './index.css';
//
// function BasicLayout(props) {
//   return (
//     <div className={styles.normal}>
//       <h1 className={styles.title}>Yay! Welcome to umi!</h1>
//       {props.children}
//     </div>
//   );
// }
//
// export default BasicLayout;

import React from 'react'
import { Menu } from 'antd'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import {
  UserOutlined,
  PartitionOutlined,
  InteractionOutlined,
  RestOutlined,
  GiftOutlined,
  UndoOutlined,
  PaperClipOutlined,
} from '@ant-design/icons'
import './App.css'
import MenuLay from '../pages/menuLay/MenuLay'
import Personal from '../pages/personal/Personal'
import Synthesis from '../pages/synthesis/Synthesis'
import Transaction from '../pages/transaction/Transaction'
import Flow from '../pages/flow/Flow'
import FlowStep from '../pages/flow/FlowStep'
import Destruction from '../pages/Destruction/Destruction'
import Reward from '../pages/reward/Reward'
import Success from '../pages/Success'
import Error from '../pages/Error'
import Language from '../pages/Language'
import logoURL from '../img/logotext.png'
import logoImg from '../img/logoImg.png'

function LogoText() {
  return (
    // <img src={logoURL} style={{width:"160px",position:"absolute",top:"40px",left:"20px"}}/>
    <img
      src={logoURL}
      style={{
        width: '160px',
        marginTop: '30px',
        marginBottom: '30px',
        marginLeft: '20px',
      }}
    />
  )
}

function LogoImg() {
  return (
    // <img src={logoImg}  style={{width:"19.02px",position:"absolute",top:"40px",left:"20px"}}/>
    <img
      src={logoImg}
      style={{
        width: '19.02px',
        marginTop: '30px',
        marginLeft: '15px',
        marginBottom: '30px',
      }}
    />
  )
}
class LogoSet extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    if (this.props.collapsed) {
      return <LogoImg />
    } else {
      return <LogoText />
    }
  }
}

class BasicLayout extends React.Component {
  state = {
    collapsed: false,
    logoURL: logoURL,
  };

  openMenu = () => {
    this.setState({
      collapsed: false,
    })
  };
  closeMenu = () => {
    this.setState({
      collapsed: true,
    })
  };

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
              <Link to="/">
                <LogoSet collapsed={this.state.collapsed} />
              </Link>
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
          <Route path="/" exact component={MenuLay} />
          <Route path="/Personal" exact component={Personal} />
          <Route path="/Synthesis" exact component={Synthesis} />
          <Route path="/Transaction" exact component={Transaction} />
          <Route path="/Flow" component={Flow} />
          <Route path="/Destruction" exact component={Destruction} />
          <Route path="/Reward" exact component={Reward} />
          <Route path="/Success" exact component={Success} />
          <Route path="/Error" exact component={Error} />
          <Route path="/FlowStep" exact component={FlowStep} />
        </Router>
        <div className="money">
          <PaperClipOutlined style={{ fontSize: '16px', color: '#fff' }} />
          <span style={{ marginLeft: '5px' }}>链接钱包</span>
        </div>
        <Language />
      </div>
    )
  }
}

export default BasicLayout
