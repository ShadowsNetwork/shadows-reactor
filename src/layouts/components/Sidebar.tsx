import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import React from 'react'
import '../app.less'
import routers from '@/router'
import { useLocation } from '@/hooks'
import viewList from '@/img/slideBarIcon/view-list.png'

const SideBar: React.FC = () => {
  const { hash } = useLocation()

  return (
    <div className="App">
      <div style={{ position: 'fixed' }}>
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
                    {router.title}
                  </Link>
                </Menu.Item>
              ))
          }
          <Menu.Item>
            <img className="slideIcon" src={viewList} alt="pancake" />
            <a
              href={'https://exchange.pancakeswap.finance/#/add/0xfb7400707dF3D76084FBEae0109f41b178f71c02/BNB'}
              target="_blank"
              rel="noreferrer"
            >
              Provide Liquidity
            </a>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  )
}

export default SideBar
