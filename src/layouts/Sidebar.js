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
  ExportOutlined
} from '@ant-design/icons'
import React, { useState } from 'react'
import './App.css'
import { useTranslation } from 'react-i18next'

function SideBar() {
  const [collapsed, setCollapsed] = useState(false)

  const openMenu = () => {
    setCollapsed(false)
  }

  const closeMenu = () => {
    setCollapsed(true)
  }

  const { t } = useTranslation()

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
          <Menu.Item>
            <Link to="/">
              <LogoSet collapsed={collapsed} />
            </Link>
          </Menu.Item>
          <Menu.Item key="Personal" icon={<UserOutlined />}>
            <Link to="/Personal">{t('person.title')}</Link>
          </Menu.Item>
          <Menu.Item key="Synthesis" icon={<PartitionOutlined />}>
            <Link to="/Synthesis">{t('synthesis.title')}</Link>
          </Menu.Item>
          <Menu.Item key="Transaction" icon={<InteractionOutlined />}>
            <Link to="/Transaction">{t('transaction.title')}</Link>
          </Menu.Item>
          {
            /*
          <Menu.Item key="Liquidity" icon={<UndoOutlined />}>
            <Link to="/Liquidity">{t('liquidity.title')}</Link>
          </Menu.Item>
          */
          }
          <Menu.Item key="Destruction" icon={<RestOutlined />}>
            <Link to="/Destruction">{t('destroy.title')}</Link>
          </Menu.Item>
          <Menu.Item key="Reward" icon={<GiftOutlined />}>
            <Link to="/Reward">{t('reward.title')}</Link>
          </Menu.Item>
          <Menu.Item key="Transfer" icon={<ExportOutlined />}>
            <Link to="/Transfer">{t('transfer.title')}</Link>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  )
}

export default SideBar
