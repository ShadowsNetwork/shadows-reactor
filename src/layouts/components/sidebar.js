import { Link } from 'react-router-dom'
import LogoSet from '@/layouts/components/logo-set'
import { Menu } from 'antd'
import React, { useState } from 'react'
import '../app.less'
import { useTranslation } from 'react-i18next'
import routers, { routerLabelMapper } from '@/router'

const SideBar = ({ onNavItemClicked }) => {
  const [collapsed, setCollapsed] = useState(false)

  const { t } = useTranslation()

  const { hash } = window.location

  return (
    <div className="App">
      <div style={{ width: 256 }}>
        <Menu
          defaultSelectedKeys={[hash.slice(1)]}
          mode="inline"
          theme="dark"
          onMouseEnter={() => {
            setCollapsed(false)
          }}
          onMouseLeave={() => {
            setCollapsed(true)
          }}
          inlineCollapsed={collapsed}
        >
          {
            routers.filter(router => router.hide !== true)
              .map(router => (
                <Menu.Item
                  key={router.path}
                  icon={<router.icon />}
                  onClick={() => onNavItemClicked(router)}
                >
                  <Link to={router.path} style={{ userSelect: 'none' }}>
                    {t(routerLabelMapper[router.key].title)}
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
