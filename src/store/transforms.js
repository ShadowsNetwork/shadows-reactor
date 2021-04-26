import { createTransform } from 'redux-persist'
import { TransactionHistory } from '@/types/TransactionHistory'

export const TransactionHistoryTransform = createTransform(
  null,
  (outboundState, _key) => {
    const transactionHistoryList = outboundState.transactionHistoryList
    if (transactionHistoryList && transactionHistoryList.length > 0) {
      return {
        ...outboundState,
        transactionHistoryList: transactionHistoryList.map(json => TransactionHistory.fromJson(json))
      }
    } else {
      return outboundState
    }
  },
  { whitelist: ['wallet'] }
)

export const WalletAndAddressTransform = createTransform(
  null,
  (outboundState, _key) => {
    // const selectedWallet = outboundState.selectedWallet
    // if (selectedWallet === 'WalletConnect') {
    //   return {
    //     ...outboundState,
    //     account: null,
    //     selectedWallet: null
    //   }
    // } else {
    return {
      ...outboundState,
    }
    // }
  },
  { whitelist: ['wallet'] }
)
