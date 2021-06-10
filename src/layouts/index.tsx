import React, { Suspense } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import './app.less'
import { IntlProvider } from 'react-intl'
import { getLocale } from 'umi'

import { QueryClient, QueryClientProvider } from 'react-query'

import '@/i18n'
import { Web3ReactProvider } from '@web3-react/core'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from '@/store'
import App from '@/layouts/App'
import { Web3Provider } from '@ethersproject/providers'
import { TransactionStatusModalProvider } from '@/contexts/TransactionStatusModalContext'
import { RefreshControllerProvider } from '@/contexts/RefreshControllerContext'
import { Web3EnvProvider } from '@/contexts/Web3EnvContext'

const queryClient = new QueryClient()

const { store, persistor } = configureStore()

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const Root: React.FC = () => (
  <Suspense fallback={<div />}>
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale={getLocale()}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Provider store={store}>
            <PersistGate loading={<LoadingOutlined />} persistor={persistor}>
              <Router>
                <Web3EnvProvider>
                  <TransactionStatusModalProvider>
                    <RefreshControllerProvider>
                      <App />
                    </RefreshControllerProvider>
                  </TransactionStatusModalProvider>
                </Web3EnvProvider>
              </Router>
            </PersistGate>
          </Provider>
        </Web3ReactProvider>
      </IntlProvider>
    </QueryClientProvider>
  </Suspense>
)

export default Root
