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
import App from '@/layouts/App'
import { TransactionStatusModalProvider } from '@/contexts/TransactionStatusModalContext'
import { RefreshControllerProvider, SLOW_INTERVAL } from '@/contexts/RefreshControllerContext'
import { Web3EnvProvider } from '@/contexts/Web3EnvContext'
import { persistor, store } from '@/store'
import { getLibrary } from '@/web3/connectors'
import { Web3ReactProvider } from '@web3-react/core'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: SLOW_INTERVAL,
      keepPreviousData: true
    }
  }
})

const Root: React.FC = () => (
  <Suspense fallback={<div />}>
    <Web3ReactProvider getLibrary={getLibrary}>
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
    </Web3ReactProvider>
  </Suspense>
)

export default Root
