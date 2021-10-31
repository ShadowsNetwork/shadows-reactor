import React, { Suspense } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import './app.less'
import { IntlProvider } from 'react-intl'
import { getLocale } from 'umi'

import { QueryClient, QueryClientProvider } from 'react-query'

import '@/i18n'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from '@/store'
import App from '@/layouts/App'
import { TransactionStatusModalProvider } from '@/contexts/TransactionStatusModalContext'
import { RefreshControllerProvider } from '@/contexts/RefreshControllerContext'
import { Web3EnvProvider } from '@/contexts/Web3EnvContext'

const queryClient = new QueryClient()

const { store, persistor } = configureStore()


const Root: React.FC = () => (
  <Suspense fallback={<div />}>
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale={getLocale()}>
        <Provider store={store}>
          <PersistGate loading={<LoadingOutlined />} persistor={persistor}>
            <Router>
              <RefreshControllerProvider>
                <Web3EnvProvider>
                  <TransactionStatusModalProvider>
                    <App />
                  </TransactionStatusModalProvider>
                </Web3EnvProvider>
              </RefreshControllerProvider>
            </Router>
          </PersistGate>
        </Provider>
      </IntlProvider>
    </QueryClientProvider>
  </Suspense>
)

export default Root
