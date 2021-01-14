import Vue from 'vue'
import VueRouter from 'vue-router'
import myself from '@/views/myself/myself'
import compose from "@/views/compose/compose";
import exchange from "@/views/exchange/exchange";
import destory from "@/views/destory/destory";
import reward from "@/views/reward/reward";
import homepageone from "@/views/homepageone";
import homepagetwo from "@/views/homepagetwo";
import homepagethree from "@/views/homepagethree";
import homepagefour from "@/views/homepagefour";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'homepageone',
  },

      //  首页1
      {
        path: '/homepageone',
        name: 'homepageone',
        component: homepageone
      },
      //  首页2
      {
        path: '/homepagetwo',
        name: 'homepagetwo',
        component: homepagetwo
      },
      //  首页3
      {
        path: '/homepagethree',
        name: 'homepagethree',
        component: homepagethree
      },
      //  首页4
      {
        path: '/homepagefour',
        name: 'homepagefour',
        component: homepagefour
      },
      //  个人信息
      {
        path: '/myself',
        name: 'myself',
        component: myself
      },
      //  合成
      {
        path: '/compose',
        name: 'compose',
        component: compose
      },
      //  交易
      {
        path: '/exchange',
        name: 'exchange',
        component: exchange
      },
      //  销毁
      {
        path: '/destory',
        name: 'destory',
        component: destory
      },
      //  奖励
      {
        path: '/reward',
        name: 'reward',
        component: reward
      }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
