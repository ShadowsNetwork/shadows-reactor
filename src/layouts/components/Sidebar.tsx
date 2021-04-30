import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import React from 'react'
import '../app.less'
import routers from '@/router'
import { useLocation } from '@/hooks'
import leaderboard from '@/img/slideBarIcon/leaderboard.png'
import viewList from '@/img/slideBarIcon/view-list.png'

const SideBar: React.FC = () => {
  const { hash } = useLocation()

  return (
    <div className="App">
      <div style={{ position:'fixed' }}>
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
            <img style={{width:'2.4rem',marginRight:'1.6rem'}} src={leaderboard} alt="bridge"/>
            <a href={'https://bridge.poly.network/'} target='_blank' rel="noreferrer">Bridge</a>
          </Menu.Item>
          <Menu.Item>
            <img style={{width:'2.4rem',marginRight:'1.6rem'}} src={viewList} alt="provide liquidity" />
            <a href={'https://exchange.pancakeswap.finance/#/pool'} target='_blank' rel="noreferrer">Provide liquidity</a>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  )
}

export default SideBar
