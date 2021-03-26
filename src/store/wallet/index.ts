import { createSlice } from '@reduxjs/toolkit'

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    account: undefined
  },
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload
    }
  }
})

export const { setAccount } = walletSlice.actions

export function getAccount(state: { wallet: { account: string } }): string {
  return state.wallet.account
}

export default walletSlice.reducer
