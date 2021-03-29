import MenuLay from '../layouts/components/menu-lay'
import Personal from '@/pages/Personal'
import Synthesis from '@/pages/Synthesis'
import Transaction from '@/pages/Transaction'
import LiquidityProvider from '@/pages/LiquidityProvider'
import Burn from '@/pages/Burn'
import Reward from '@/pages/Reward'
import FlowStep from '@/pages/Liquidity/FlowStep'
import Success from '@/pages/Success'
import Error from '@/pages/Error'
import Transfer from '@/pages/Transfer'

import LiquidityImage from '@/img/background/liquidity.jpg'
import Map from '@/img/background/map.jpg'
import Welcome from '@/img/background/welcome.jpg'

import calendar from '@/img/slideBarIcon/calendar.png'
import comment from '@/img/slideBarIcon/comment.png'
import dashboard from '@/img/slideBarIcon/Dashboard.png'
import kleaderboard from '@/img/slideBarIcon/leaderboard.png'
import money from '@/img/slideBarIcon/money-bill-stack.png'
import shopping from '@/img/slideBarIcon/shopping-bag.png'
import viewList from '@/img/slideBarIcon/view-list.png'

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
  /** 首页 */
  {
    path: '/',
    key: 'index',
    component: MenuLay,
    hide: true,
    backgroundImage: Welcome
  },

  /** 显示的菜单、路由 */
  {
    path: '/personal',
    key: 'person',
    component: Personal,
    image: dashboard,
    // icon: UserOutlined,
    backgroundImage: Map
  },
  {
    path: '/synthesis',
    key: 'synthesis',
    component: Synthesis,
    image: kleaderboard,
    // icon: PartitionOutlined,
    backgroundImage: Map
  },
  {
    path: '/burn',
    key: 'destroy',
    component: Burn,
    image: viewList,
    // icon: RestOutlined,
    backgroundImage: Map
  },
  {
    path: '/transaction',
    key: 'transaction',
    component: Transaction,
    image: money,
    // icon: InteractionOutlined,
    backgroundImage: Map
  },
  {
    path: '/reward',
    key: 'reward',
    component: Reward,
    image: calendar,
    // icon: GiftOutlined,
    backgroundImage: Map
  },
  {
    path: '/transfer',
    key: 'transfer',
    component: Transfer,
    image: shopping,
    // icon: ExportOutlined,
    backgroundImage: LiquidityImage
  },
  {
    path: '/liquidity',
    key: 'liquidity',
    component: LiquidityProvider,
    image: comment,
    // icon: ExportOutlined,
    backgroundImage: LiquidityImage
  },

  /** 隐藏的路由 */
  {
    path: '/success',
    key: 'success',
    component: Success,
    hide: true,
    backgroundImage: Map
  },
  {
    path: '/error',
    key: 'error',
    component: Error,
    hide: true,
    backgroundImage: Map
  },
  {
    path: '/FlowStep',
    key: 'flowstep',
    component: FlowStep,
    hide: true,
    backgroundImage: LiquidityImage
  }
]

export default routers
