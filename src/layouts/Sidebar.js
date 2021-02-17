import { Link } from 'react-router-dom'
import LogoSet from '@/layouts/LogoSet'
import { Menu } from 'antd'
import {
  GiftOutlined,
  InteractionOutlined,
  PartitionOutlined,
  RestOutlined,
  UndoOutlined,
  UserOutlined,
} from '@ant-design/icons'
import React, { useState } from 'react'
import './App.css'

function SideBar() {
  const [collapsed, setCollapsed] = useState(false)

  const openMenu = () => {
    setCollapsed(false)
  }

  const closeMenu = () => {
    setCollapsed(true)
  }

  return <div className='App'>
    <div style={{ width: 256 }}>
      <Link to="/">
        <LogoSet collapsed={collapsed} />
      </Link>
      <Menu
        defaultSelectedKeys={['Personal']}
        defaultOpenKeys={['sub1']}
        mode='inline'
        theme='dark'
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
        inlineCollapsed={collapsed}
      >
        <Menu.Item key='Personal' icon={<UserOutlined />}>
          <Link to='/Personal'>个人信息</Link>
        </Menu.Item>
        <Menu.Item key='Synthesis' icon={<PartitionOutlined />}>
          <Link to='/Synthesis'>合成</Link>
        </Menu.Item>
        <Menu.Item key='Transaction' icon={<InteractionOutlined />}>
          <Link to='/Transaction'>交易</Link>
        </Menu.Item>
        <Menu.Item key='Flow' icon={<UndoOutlined />}>
          <Link to='/Flow'>流动性</Link>
        </Menu.Item>
        <Menu.Item key='Destruction' icon={<RestOutlined />}>
          <Link to='/Destruction'>销毁</Link>
        </Menu.Item>
        <Menu.Item key='Reward' icon={<GiftOutlined />}>
          <Link to='/Reward'>奖励</Link>
        </Menu.Item>
      </Menu>
    </div>
  </div>

}

export default SideBar
