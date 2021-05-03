import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import React from 'react'
import '../app.less'
import { useTranslation } from 'react-i18next'
import routers, { routerLabelMapper } from '@/router'
import { useLocation } from '@/hooks'
import leaderboard from '@/img/slideBarIcon/leaderboard.png'
import viewList from '@/img/slideBarIcon/view-list.png'

const SideBar: React.FC = () => {
  const { t } = useTranslation()

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
                    {t(routerLabelMapper[router.key].title)}
                  </Link>
                </Menu.Item>
              ))
          }
          <Menu.Item>
            <img style={{width:'2.4rem',marginRight:'1.6rem'}} src={leaderboard}/>
            <a href={'https://bridge.poly.network/'} target='_blank' rel="noreferrer">Bridge</a>
          </Menu.Item>
          <Menu.Item>
            <img style={{width:'2.4rem',marginRight:'1.6rem'}} src={viewList}/>
            <a href={'https://exchange.pancakeswap.finance/#/add/0xfb7400707dF3D76084FBEae0109f41b178f71c02/BNB'} target='_blank' rel="noreferrer">Provide liquidity</a>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  )
}

export default SideBar
