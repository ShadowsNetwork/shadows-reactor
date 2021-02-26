import MenuLay from '@/pages/menuLay/MenuLay'
import Personal from '@/pages/Personal'
import Synthesis from '@/pages/Synthesis'
import Transaction from '@/pages/Transaction'
import Liquidity from '@/pages/Liquidity'
import Destruction from '@/pages/Destruction'
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
  UserOutlined,
} from '@ant-design/icons'

export const routerLabelMapper = {
  person: { title: 'person.title' },
  synthesis: { title: 'synthesis.title' },
  transaction: { title: 'transaction.title' },
  liquidity: { title: 'liquidity.title' },
  destroy: { title: 'destroy.title' },
  reward: { title: 'reward.title' },
  transfer: { title: 'transfer.title' },
}

const routers = [
  /** 首页 */
  {
    path: '/',
    key: 'index',
    component: MenuLay,
    hide: true,
    backgroundImage: Welcome,
  },

  /** 显示的菜单、路由 */
  {
    path: '/Personal',
    key: 'person',
    component: Personal,
    icon: UserOutlined,
    backgroundImage: Map,
  },
  {
    path: '/Synthesis',
    key: 'synthesis',
    component: Synthesis,
    icon: PartitionOutlined,
    backgroundImage: Map,
  },
  {
    path: '/Transaction',
    key: 'transaction',
    component: Transaction,
    icon: InteractionOutlined,
    backgroundImage: Map,
  },
  {
    path: '/Destruction',
    key: 'destroy',
    component: Destruction,
    icon: RestOutlined,
    backgroundImage: Map,
  },
  {
    path: '/Reward',
    key: 'reward',
    component: Reward,
    icon: GiftOutlined,
    backgroundImage: Map,
  },
  {
    path: '/Transfer',
    key: 'transfer',
    component: Transfer,
    icon: ExportOutlined,
    backgroundImage: LiquidityImage,
  },

  /** 隐藏的路由 */
  {
    path: '/Liquidity',
    key: 'liquidity',
    component: Liquidity,
    hide: true,
  },
  {
    path: '/Success',
    key: 'success',
    component: Success,
    hide: true,
    backgroundImage: Map,
  },
  {
    path: '/Error',
    key: 'error',
    component: Error,
    hide: true,
    backgroundImage: Map,
  },
  {
    path: '/FlowStep',
    key: 'flowstep',
    component: FlowStep,
    hide: true,
    backgroundImage: LiquidityImage,
  },
]

export default routers