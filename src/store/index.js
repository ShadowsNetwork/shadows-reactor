import { combineReducers, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import wallet from './wallet'
import app from './app'
import bridge from './bridge'
import { TransactionHistoryTransform, WalletAndAddressTransform } from '@/store/transforms'

function configureStore(initialState = {}) {
  const reducer = combineReducers({
    wallet,
    app,
    bridge
  })

  const store = createStore(persistReducer({
    storage,
    key: 'shadows-reactor',
    debug: true,
    blacklist: [
      ''
    ],
    transforms: [
      TransactionHistoryTransform, WalletAndAddressTransform
    ]
  }, reducer), initialState)

  const persistor = persistStore(store, null/*, () => {
  }*/)

  return {
    store,
    persistor
  }
}

export default configureStore
