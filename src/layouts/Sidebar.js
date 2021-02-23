import { Link } from 'react-router-dom'
import LogoSet from '@/layouts/LogoSet'
import { Menu } from 'antd'
import React, { useState } from 'react'
import './App.css'
import { useTranslation } from 'react-i18next'
import routers, { routerLabelMapper } from '@/layouts/routers'

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
          {
            routers.filter((router) => router.hide !== true).map((router) => (
              <Menu.Item key={router.path} icon={<router.icon />}>
                <Link to={router.path}>
                  { t(routerLabelMapper[router.key].title) }
                </Link>
              </Menu.Item>
            ))
          }
        </Menu>
      </div>
    </div>
  )
}

export default SideBar
