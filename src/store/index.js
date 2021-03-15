import { combineReducers, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import wallet from './wallet'

function configureStore(initialState = {}) {
  const reducer = combineReducers({
    wallet
  })

  const store = createStore(persistReducer({
    key: 'shadows-reactor',
    debug: true,
    storage
  }, reducer), initialState)

  const persistor = persistStore(store, null, () => {
    // console.log('restoredState', store.getState())
  })

  return {
    store,
    persistor
  }
}

export default configureStore
