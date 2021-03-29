import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import React, { useState } from 'react'
import '../app.less'
import { useTranslation } from 'react-i18next'
import routers, { routerLabelMapper } from '@/router'
import { useLocation } from '@/hooks'

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false)

  const { t } = useTranslation()

  const { hash } = useLocation()

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
