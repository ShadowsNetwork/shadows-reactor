import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import React from 'react'
import '../app.less'
import { useTranslation } from 'react-i18next'
import routers, { routerLabelMapper } from '@/router'
import { useLocation } from '@/hooks'

const SideBar: React.FC = () => {
  const { t } = useTranslation()

  const { hash } = useLocation()

  return (
    <div className="App">
      <div style={{ width: 256 }}>
        <Menu
          defaultSelectedKeys={[hash.slice(1)]}
          mode="inline"
          theme="dark"
        >
          {
            routers.filter(router => !router.hide)
              .map(router => (
                <Menu.Item
                  key={router.key}
                >
                  <img className="slideIcon" src={router.image} alt="" />
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
