import Welcome from '@/pages/Welcome'
import Personal from '@/pages/Personal'
import Synthesis from '@/pages/Synthesis'
import Transaction from '@/pages/Transaction'
import Pool from '@/pages/LiquidityProvider'
import Burn from '@/pages/Burn'
import Reward from '@/pages/Reward'
import FlowStep from '@/pages/Liquidity/FlowStep'
import Transfer from '@/pages/Transfer'

import LiquidityImage from '@/img/background/liquidity.jpg'
import Map from '@/img/background/map.jpg'
import WelcomeImg from '@/img/background/welcome.jpg'

import calendar from '@/img/slideBarIcon/calendar.png'
import comment from '@/img/slideBarIcon/comment.png'
import dashboard from '@/img/slideBarIcon/Dashboard.png'
import leaderboard from '@/img/slideBarIcon/leaderboard.png'
import money from '@/img/slideBarIcon/money-bill-stack.png'
import shopping from '@/img/slideBarIcon/shopping-bag.png'
import viewList from '@/img/slideBarIcon/view-list.png'

// import { lazy } from 'react'
// const Welcome = lazy(() => import('@/pages/Welcome'))
// const Personal = lazy(() => import('@/pages/Personal'))
// const Synthesis = lazy(() => import('@/pages/Synthesis'))
// const Transaction = lazy(() => import('@/pages/Transaction'))
// const LiquidityProvider = lazy(() => import('@/pages/LiquidityProvider'))
// const Burn = lazy(() => import('@/pages/Burn'))
// const Reward = lazy(() => import('@/pages/Reward'))
// const FlowStep = lazy(() => import('@/pages/Liquidity/FlowStep'))
// const Transfer = lazy(() => import('@/pages/Transfer'))

export const routerLabelMapper = {
  person: { title: 'person.title' },
  synthesis: { title: 'synthesis.title' },
  transaction: { title: 'transaction.title' },
  liquidity: { title: 'liquidity.title' },
  destroy: { title: 'destroy.title' },
  reward: { title: 'reward.title' },
  transfer: { title: 'transfer.title' }
}

const routers = [
  /** index page */
  /*{
    path: '/welcome',
    key: 'welcome',
    component: Welcome,
    hide: true,
    backgroundImage: WelcomeImg
  },

  /!** displayed routers *!/
  {
    path: '/personal',
    key: 'person',
    component: Personal,
    image: dashboard,
    backgroundImage: Map
  },
  {
    path: '/synthesis',
    key: 'synthesis',
    component: Synthesis,
    image: leaderboard,
    backgroundImage: Map
  },
  {
    path: '/burn',
    key: 'destroy',
    component: Burn,
    image: viewList,
    backgroundImage: Map
  },
  {
    path: '/transaction',
    key: 'transaction',
    component: Transaction,
    image: money,
    backgroundImage: Map
  },
  {
    path: '/reward',
    key: 'reward',
    component: Reward,
    image: calendar,
    backgroundImage: Map
  },
  {
    path: '/transfer',
    key: 'transfer',
    component: Transfer,
    image: shopping,
    backgroundImage: LiquidityImage
  },*/
  {
    path: '/liquidity',
    key: 'liquidity',
    component: Pool,
    image: comment,
  },

  /** hidden routers */
  {
    path: '/FlowStep',
    key: 'flowstep',
    component: FlowStep,
    hide: true,
    backgroundImage: LiquidityImage
  }
]

export default routers
