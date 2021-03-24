import { createSlice } from '@reduxjs/toolkit'

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    account: undefined
  },
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload
    },
  },
})

export const { setAccount } = walletSlice.actions

export const getAccount = state => state.wallet.account

export default walletSlice.reducer
