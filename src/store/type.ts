import { TransactionHistory } from '@/types/TransactionHistory'
import { WalletKeys } from '@/web3/connectors'
import { SupportedEthereumChainId } from '@/web3/network'

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
  selectedWallet?: WalletKeys
  account?: string
  transactionHistoryList: Array<TransactionHistory>
  chainId?: SupportedEthereumChainId
  rpcUrl?: string
}
