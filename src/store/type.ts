import { WalletNames } from '@/web3/wallets'
import { TransactionHistory } from '@/types/TransactionHistory'

export type State = {
  app: AppState
  wallet: WalletState
}

export type AppState = {
}

export type WalletState = {
  selectedWallet?: WalletNames
  account?: string,
  transactionHistoryList: Array<TransactionHistory>
}
