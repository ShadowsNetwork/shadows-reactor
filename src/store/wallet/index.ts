import { createSlice } from '@reduxjs/toolkit'
import { TransactionHistory } from '@/types/TransactionHistory'

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    account: undefined,
    transactionHistoryList: new Array<TransactionHistory>()
  },
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload
    },
    appendTransactionHistory: (state, action) => {
      const transactionHistory = action.payload as TransactionHistory

      if (!state.transactionHistoryList) {
        state.transactionHistoryList = new Array(transactionHistory)
      } else {
        const length = state.transactionHistoryList.length
        if (length >= 5) {
          state.transactionHistoryList = state.transactionHistoryList.slice(length - 4)
        }
        state.transactionHistoryList.push(transactionHistory)
      }
    },
    updateTransactionHistoryStatus: (state, action) => {
      const target = action.payload as TransactionHistory

      const filtered = state.transactionHistoryList.filter(t => t.hash === target.hash)
      if (filtered.length === 0) {
        console.error('no matched transaction history')
      } else {
        const index = state.transactionHistoryList.indexOf(filtered[0])
        state.transactionHistoryList[index] = target
        // !!force state update
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.transactionHistoryList.push(state.transactionHistoryList.pop()!)
      }
    }
  }
})

type WalletState = {
  wallet: {
    account: string,
    transactionHistoryList: Array<TransactionHistory>
  }
}

export function getTransactionHistoryList(state: WalletState): Array<TransactionHistory> {
  return state.wallet.transactionHistoryList ?? []
}

export function getAccount(state: WalletState): string {
  return state.wallet.account
}

export const {
  setAccount,
  appendTransactionHistory,
  updateTransactionHistoryStatus
} = walletSlice.actions

export default walletSlice.reducer
