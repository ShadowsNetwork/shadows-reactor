import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { LoadingOutlined, PaperClipOutlined } from '@ant-design/icons'
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
import Map from '@/img/background/map.jpg'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from '@/store'

const queryClient = new QueryClient()

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function App() {
  const { hash } = window.location

  const currentRouter = routers.filter(router => router.path === hash.slice(1))[0]

  const [background, setBackground] = useState(currentRouter ? currentRouter.backgroundImage : Map)

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
  const [initialized, setInitialized] = useState(false)
  const { store, persistor } = configureStore()

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')

        provider.ready.then(network => {
          const { chainId } = network
          console.log(chainId)
          setSigner({ networkId: chainId, signer: provider.getSigner() })
          setInitialized(true)
        })

        provider.on('network', (newNetwork, oldNetwork) => {
          // When a Provider makes its initial connection, it emits a "network"
          // event with a null oldNetwork along with the newNetwork. So, if the
          // oldNetwork exists, it represents a changing network
          if (oldNetwork) {
            window.location.reload()
          }
        })
      }
    }
    initProvider()
  }, [])

  return (
    <Suspense fallback={<div />}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale={getLocale()}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Provider store={store}>
              <PersistGate loading={<LoadingOutlined />} persistor={persistor}>
                <Router>
                  {initialized && <App />}
                </Router>
              </PersistGate>
            </Provider>
          </Web3ReactProvider>
        </IntlProvider>
      </QueryClientProvider>
    </Suspense>
  )
}

export default Root
