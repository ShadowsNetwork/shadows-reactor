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
import { ethers } from 'ethers'
import { setSigner } from '@/ShadowsJs/dowsJSConnector'

const queryClient = new QueryClient()

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function App() {
  const { pathname } = window.location

  const currentRouter = routers.filter(router => router.path === pathname)[0]

  const [background, setBackground] = useState(currentRouter.backgroundImage)

  const handleNavItemClicked = router => {
    setBackground(router.backgroundImage)
  }

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'black',
      }}
    >
      <SideBar onNavItemClicked={handleNavItemClicked} />
      {
        routers.map(router => (
          <Route
            path={router.path}
            exact
            component={router.component}
            key={router.key}
          />
        ))
      }
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
  )
}

function Root() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setSigner({ networkId: 42, signer: provider.getSigner() })
  }

  return (
    <Suspense fallback={<div />}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale={getLocale()}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Router>
              <App />
            </Router>
          </Web3ReactProvider>
        </IntlProvider>
      </QueryClientProvider>
    </Suspense>
  )
}

export default Root
