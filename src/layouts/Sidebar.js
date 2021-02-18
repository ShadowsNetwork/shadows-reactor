import { Link } from 'react-router-dom';
import LogoSet from '@/layouts/LogoSet';
import { Menu } from 'antd';
import {
  GiftOutlined,
  InteractionOutlined,
  PartitionOutlined,
  RestOutlined,
  UndoOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import './App.css';
import { formatMessage } from '../.umi/plugin-locale/localeExports';

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);

  const openMenu = () => {
    setCollapsed(false);
  };

  const closeMenu = () => {
    setCollapsed(true);
  };

  return (
    <div className="App">
      <div style={{ width: 256 }}>
        <Menu
          defaultSelectedKeys={['Personal']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
          inlineCollapsed={collapsed}
        >
          <Link to="/">
            <LogoSet collapsed={collapsed} />
          </Link>
          <Menu.Item key="Personal" icon={<UserOutlined />}>
            <Link to="/Personal">{formatMessage({ id: 'person.title' })}</Link>
          </Menu.Item>
          <Menu.Item key="Synthesis" icon={<PartitionOutlined />}>
            <Link to="/Synthesis">{formatMessage({ id: 'synthesis.title' })}</Link>
          </Menu.Item>
          <Menu.Item key="Transaction" icon={<InteractionOutlined />}>
            <Link to="/Transaction">{formatMessage({ id: 'transaction.title' })}</Link>
          </Menu.Item>
          <Menu.Item key="Flow" icon={<UndoOutlined />}>
            <Link to="/Flow">{formatMessage({ id: 'fluidity.title' })}</Link>
          </Menu.Item>
          <Menu.Item key="Destruction" icon={<RestOutlined />}>
            <Link to="/Destruction">{formatMessage({ id: 'destroy.title' })}</Link>
          </Menu.Item>
          <Menu.Item key="Reward" icon={<GiftOutlined />}>
            <Link to="/Reward">{formatMessage({ id: 'reward.title' })}</Link>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
}

export default SideBar;
