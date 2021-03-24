import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import './app.less'
import { IntlProvider } from 'react-intl'
import { getLocale } from 'umi'

import { QueryClient, QueryClientProvider } from 'react-query'

import '@/i18n'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { setSigner } from '@/ShadowsJs/dowsJSConnector'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from '@/store'
import App from '@/layouts/app'

const queryClient = new QueryClient()

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const Root = () => {
  const [initialized, setInitialized] = useState(false)
  const {
    store,
    persistor
  } = configureStore()

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')

        provider.ready.then(network => {
          const { chainId } = network
          setSigner({
            networkId: chainId,
            signer: provider.getSigner()
          })
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
