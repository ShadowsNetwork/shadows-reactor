import Pool from '@/pages/LiquidityProvider'
import FlowStep from '@/pages/Liquidity/FlowStep'

import LiquidityImage from '@/img/background/liquidity.jpg'
import money from '@/img/slideBarIcon/money-bill-stack.png'
import Bridge from '@/pages/Bridge'
import leaderboard from '@/img/slideBarIcon/leaderboard.png'

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
  staking: { title: 'liquidity.title' },
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
    key: 'staking',
    path: '/staking',
    title: 'Staking',
    component: Pool,
    image: money,
  },
  {
    path: '/bridge',
    key: 'bridge',
    title: 'Bridge',
    component: Bridge,
    image: leaderboard,
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
