import React, { Suspense, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { PaperClipOutlined } from '@ant-design/icons'
import './App.css'
import { IntlProvider } from 'react-intl'
import { getLocale } from 'umi'

import Wallet from '@/components/Wallet'
import LanguageSelector from '@/components/LanguageSelector'

import SideBar from '@/layouts/Sidebar'

import { QueryClient, QueryClientProvider } from 'react-query'

import '@/i18n'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import routers from '@/layouts/routers'

const queryClient = new QueryClient()

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function BasicLayout() {
  const [background, setBackground] = useState()

  const render = (router) => {
    setBackground(router.backgroundImage)
    return <router.component />
  }

  return (
    <Suspense fallback={<div />}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale={getLocale()}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <div
              className="App"
              style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'black',
              }}
            >
              <Router>
                <SideBar />
                {
                  routers.map((router) => (
                    <Route
                      path={router.path}
                      exact
                      render={() => render(router)}
                      key={router.key}
                    />
                  ))
                }
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
          </Web3ReactProvider>
        </IntlProvider>
      </QueryClientProvider>
    </Suspense>
  )
}

export default BasicLayout
