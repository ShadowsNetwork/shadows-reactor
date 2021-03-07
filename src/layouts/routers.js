import MenuLay from './MenuLay'
import Personal from '@/pages/Personal'
import Synthesis from '@/pages/Synthesis'
import Transaction from '@/pages/Transaction'
import Liquidity from '@/pages/Liquidity'
import Burn from '@/pages/Burn'
import Reward from '@/pages/Reward'
import FlowStep from '@/pages/Liquidity/FlowStep'
import Success from '@/pages/Success'
import Error from '@/pages/Error'
import Transfer from '@/pages/Transfer'

import LiquidityImage from '@/img/background/liquidity.jpg'
import Map from '@/img/background/map.jpg'
import Welcome from '@/img/background/welcome.jpg'

import {
  ExportOutlined,
  GiftOutlined,
  InteractionOutlined,
  PartitionOutlined,
  RestOutlined,
  UserOutlined
} from '@ant-design/icons'

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
    icon: UserOutlined,
    backgroundImage: Map
  },
  {
    path: '/synthesis',
    key: 'synthesis',
    component: Synthesis,
    icon: PartitionOutlined,
    backgroundImage: Map
  },
  {
    path: '/burn',
    key: 'destroy',
    component: Burn,
    icon: RestOutlined,
    backgroundImage: Map
  },
  {
    path: '/transaction',
    key: 'transaction',
    component: Transaction,
    icon: InteractionOutlined,
    backgroundImage: Map
  },
  {
    path: '/reward',
    key: 'reward',
    component: Reward,
    icon: GiftOutlined,
    backgroundImage: Map
  },
  {
    path: '/transfer',
    key: 'transfer',
    component: Transfer,
    icon: ExportOutlined,
    backgroundImage: LiquidityImage
  },

  /** 隐藏的路由 */
  {
    path: '/liquidity',
    key: 'liquidity',
    component: Liquidity,
    hide: true
  },
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
