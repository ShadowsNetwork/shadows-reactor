import Pool from '@/pages/LiquidityProvider'
import Bridge from '@/pages/Bridge'
import TradePage from '@/pages/Trade'
import HomePage from '@/pages/Home'

import StakingIcon from '@/img/menu-icons/staking.png'
import BridgeIcon from '@/img/menu-icons/bridge.png'
import HomeIcon from '@/img/menu-icons/home.png'
import TradeIcon from '@/img/menu-icons/trade.png'
import React from 'react'

export type Router = {
  path: string,
  key: string,
  title: string,
  component: React.FC,
  icon: any
}

const routers: Router[] = [
  /** index page */
  {
    path: '/',
    key: 'home',
    title: 'Home',
    component: HomePage,
    icon: HomeIcon
  },
  {
    path: '/trade',
    key: 'trade',
    title: 'Trade',
    component: TradePage,
    icon: TradeIcon
  },
  {
    path: '/staking',
    key: 'staking',
    title: 'Staking',
    component: Pool,
    icon: StakingIcon
  },
  {
    path: '/bridge',
    key: 'bridge',
    title: 'Bridge',
    component: Bridge,
    icon: BridgeIcon
  }
]

export default routers
