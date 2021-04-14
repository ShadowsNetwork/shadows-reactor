import { createSlice } from '@reduxjs/toolkit'

export const transactionHistorySlice = createSlice({
  name: 'transactionHistory',
  initialState: {
    transactionHistoryList: []
  },
  reducers: {
    setTransactionHistoryList: (state, action) => {
      state.transactionHistoryList = action.payload
    }
  }
})

export const { setTransactionHistoryList } = transactionHistorySlice.actions

type StateType = {
  transactionHistory: {
    transactionHistoryList: string
  }
}

export function getTransactionHistoryList(state: StateType): string {
  return state.transactionHistory.transactionHistoryList
}

export default transactionHistorySlice.reducer
