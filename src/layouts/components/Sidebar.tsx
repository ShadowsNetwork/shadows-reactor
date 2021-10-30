import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import React from 'react'
import '../app.less'
import routers from '@/router'
import { useLocation } from '@/hooks'

const SideBar: React.FC = () => {
  const { hash } = useLocation()

  const handleGtag = (key: string) => {
    gtag('event', key)
  }

  return (
    <Menu
      selectedKeys={[hash.slice(1)]}
      mode="inline"
      theme="dark"
    >
      {
        routers
          .map(router => (
            <Menu.Item
              key={router.path}
              onClick={() => { handleGtag(router.key) }}
            >
              <img className="slideIcon" src={router.icon} alt="" />
              <Link to={router.path} style={{ userSelect: 'none' }}>
                {router.title}
              </Link>
            </Menu.Item>
          ))
      }
      <Menu.Item>
        <img className="slideIcon" src={require('@/img/menu-icons/liquidity-provider.png')} alt="pancake" />
        <a
          href={'https://exchange.pancakeswap.finance/#/add/0xfb7400707dF3D76084FBEae0109f41b178f71c02/BNB'}
          target="_blank"
          rel="noreferrer"
        >
          Provide Liquidity
        </a>
      </Menu.Item>
    </Menu>
  )
}

export default SideBar
