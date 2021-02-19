import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { PaperClipOutlined } from '@ant-design/icons'
import './App.css'
import { IntlProvider } from 'react-intl'
import { getLocale } from 'umi'

import MenuLay from '@/pages/menuLay/MenuLay'
import Personal from '@/pages/Personal'
import Synthesis from '@/pages/Synthesis'
import Transaction from '@/pages/Transaction'
import Liquidity from '@/pages/Liquidity'
import FlowStep from '@/pages/Liquidity/FlowStep'
import Destruction from '@/pages/Destruction'
import Reward from '@/pages/Reward'
import Success from '@/pages/Success'
import Error from '@/pages/Error'

import Wallet from '@/components/Wallet'
import LanguageSelector from '@/components/LanguageSelector'

import SideBar from '@/layouts/Sidebar'

import '@/i18n'

function BasicLayout() {
  return (
    <Suspense fallback={<div />}>
      <IntlProvider locale={getLocale()}>
        <div className="App">
          <Router>
            <SideBar />
            <Route path="/" exact component={MenuLay} />
            <Route path="/Personal" exact component={Personal} />
            <Route path="/Synthesis" exact component={Synthesis} />
            <Route path="/Transaction" exact component={Transaction} />
            <Route path="/Liquidity" component={Liquidity} />
            <Route path="/Destruction" exact component={Destruction} />
            <Route path="/Reward" exact component={Reward} />
            <Route path="/Success" exact component={Success} />
            <Route path="/Error" exact component={Error} />
            <Route path="/FlowStep" exact component={FlowStep} />
          </Router>
          <div className="money">
            <PaperClipOutlined style={{
              fontSize: '16px',
              color: '#fff',
            }}
            />
            <Wallet />
          </div>
          <LanguageSelector />
        </div>
      </IntlProvider>
    </Suspense>
  )
}

export default BasicLayout
