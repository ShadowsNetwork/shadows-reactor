import { Link } from 'react-router-dom'
import LogoSet from '@/layouts/LogoSet'
import { Menu } from 'antd'
import React, { useState } from 'react'
import './App.css'
import { useTranslation } from 'react-i18next'
import routers, { routerLabelMapper } from '@/layouts/routers'

function SideBar(props) {
  const [collapsed, setCollapsed] = useState(false)

  const { t } = useTranslation()

  const { pathname } = window.location

  const { onNavItemClicked } = props

  return (
    <div className="App">
      <div style={{ width: 256 }}>
        <Menu
          defaultSelectedKeys={[pathname]}
          mode="inline"
          theme="dark"
          onMouseEnter={() => { setCollapsed(false) }}
          onMouseLeave={() => { setCollapsed(true) }}
          inlineCollapsed={collapsed}
        >
          <Menu.Item onClick={() => onNavItemClicked(routers[0])} style={{ overflow: 'hidden' }}>
            <Link to="/" style={{ overflow: 'hidden' }}>
              <LogoSet collapsed={collapsed} />
            </Link>
          </Menu.Item>
          {
            routers.filter((router) => router.hide !== true).map((router) => (
              <Menu.Item
                key={router.path}
                icon={<router.icon />}
                onClick={() => onNavItemClicked(router)}
              >
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
