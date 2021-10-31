import { WalletNames } from '@/web3/wallets'
import { TransactionHistory } from '@/types/TransactionHistory'
import { SUPPORT_ETHEREUM_CHAIN_ID } from '@/ShadowsJs/networkHelper'

export type State = {
  app: AppState
  wallet: WalletState
  bridge: BridgeState
}

export type AppState = {
}

export type BridgeState = {
  sourcePolyChainId: number
}

export type WalletState = {
  selectedWallet?: WalletNames
  account?: string
  transactionHistoryList: Array<TransactionHistory>
  chainId?: SUPPORT_ETHEREUM_CHAIN_ID
  rpcUrl?: string
}
