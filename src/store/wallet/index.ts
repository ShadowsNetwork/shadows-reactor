import { createSlice } from '@reduxjs/toolkit'
import { TransactionHistory } from '@/types/TransactionHistory'
import { State, WalletState } from '@/store/type'
import { SUPPORT_ETHEREUM_CHAIN_ID } from '@/ShadowsJs/networkHelper'

const initialState: WalletState = {
  selectedWallet: undefined,
  account: undefined,
  transactionHistoryList: new Array<TransactionHistory>(),
  chainId: undefined,
  rpcUrl: undefined
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setChainId: (state, action) => {
      if (!action.payload.toString().includes('0x')) {
        throw new Error(`Error chain id: ${action.payload}. Chain id must start with '0x'`)
      }

      state.chainId = action.payload
    },
    setRpcUrl: (state, action) => {
      state.rpcUrl = action.payload
    },
    setAccount: (state, action) => {
      if (!action.payload) {
        console.error('Account was set to null!')
      }

      if (state.account === action.payload) {
        return
      }

      state.account = action.payload
      state.transactionHistoryList = []
    },
    setSelectedWallet: (state, action) => {
      state.selectedWallet = action.payload
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
        console.error('No matched transaction history')
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

export function getTransactionHistoryList(state: State): Array<TransactionHistory> {
  return state.wallet.transactionHistoryList ?? []
}

export function getChainId(state: State): SUPPORT_ETHEREUM_CHAIN_ID | undefined {
  return state.wallet.chainId
}

export function getRpcUrl(state: State): string | undefined {
  return state.wallet.rpcUrl
}

export function getAccount(state: State): string | undefined {
  return state.wallet.account
}

export function getSelectedWallet(state: State): string | undefined {
  return state.wallet.selectedWallet
}

export const {
  setRpcUrl,
  setChainId,
  setAccount,
  setSelectedWallet,
  appendTransactionHistory,
  updateTransactionHistoryStatus
} = walletSlice.actions

export default walletSlice.reducer
