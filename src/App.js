import React from 'react';
import { Menu, Button } from 'antd';
import {BrowserRouter as Router , Route} from 'react-router-dom'
import {
  UserOutlined,
  PartitionOutlined,
  InteractionOutlined,
  RestOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import './App.css';
import MenuLay from "./MenuLay";
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
    console.log(props)
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
        <div style={{ width: 256 }}>
          <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="dark"
            onMouseEnter={this.openMenu}
            onMouseLeave={this.closeMenu}
            inlineCollapsed={this.state.collapsed}
          >
            <LogoSet collapsed={this.state.collapsed}/>
            <Menu.Item key="1" icon={<UserOutlined />}>
              个人信息
            </Menu.Item>
            <Menu.Item key="2" icon={<PartitionOutlined />}>
              合成
            </Menu.Item>
            <Menu.Item key="3" icon={<InteractionOutlined />}>
              交易
            </Menu.Item>
            <Menu.Item key="4" icon={<RestOutlined />}>
              销毁
            </Menu.Item>
            <Menu.Item key="5" icon={<GiftOutlined />}>
              奖励
            </Menu.Item>
          </Menu>
        </div>
        <MenuLay/>
      </div>
    );
  }
}

export default App;
