import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import {
  getSelectedWallet, getTransactionHistoryList, updateTransactionHistoryStatus
} from '@/store/wallet'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { WalletNames } from '@/web3/wallets'
import {
  BridgeDows, TransactionHistory, TransactionHistoryImplementationClassType, TransactionStatus
} from '@/types/TransactionHistory'
import axios from 'axios'
import { PolyTransactionStatus } from '@/types/PolyTransactionStatus'
import { useRefreshController } from '@/contexts/RefreshControllerContext'

export function useLocation(): Location {
  const [location, setLocation] = useState(window.location)

  const listenToPopstate = () => {
    setLocation(window.location)
  }

  useEffect(() => {
    window.addEventListener('popstate', listenToPopstate)

    return () => {
      window.removeEventListener('popstate', listenToPopstate)
    }
  }, [])

  return location
}

export function useErrorMessage(): any {
  const selectedWallet = useSelector(getSelectedWallet) as WalletNames | undefined

  return useCallback((e: any) => {
    if (!selectedWallet) {
      return 'No Wallet Connected'
    } else if (selectedWallet === 'Metamask') {
      const detailMessage = e.data ? ` (${e.data.message})` : ''
      return `${e.message}${detailMessage}`
    } else if (selectedWallet === 'BSC') {
      return e.error
    } else if (selectedWallet === 'WalletConnect') {
      return e.toString()
    } else {
      throw new Error('Unknown selected wallet')
    }
  }, [selectedWallet])
}

export function useListenBridgeTransactionStatus() {
  const dispatch = useDispatch()
  const transactionList = useSelector(getTransactionHistoryList)

  const task = bridgeTransactions => {
    bridgeTransactions.forEach(async (t: BridgeDows) => {
      const { hash } = t

      await axios.post('https://bridge.poly.network/v1/transactionofhash', {
        hash: hash.substring(2)
      })
        .then(r => {
          const state = r.data.State
          const transactionsWithHash = r.data.TransactionState.filter(s => s.Hash)
          const lastTransaction = transactionsWithHash[transactionsWithHash.length - 1]

          if (t.state !== state) {
            t.state = state
            t.lastTransactionHash = lastTransaction.Hash
            t.lastTransactionPolyChainId = lastTransaction.ChainId

            if (state === PolyTransactionStatus.FINISHED) {
              t.complete()
              dispatch(updateTransactionHistoryStatus(t))
            }
            dispatch(updateTransactionHistoryStatus(t))
          }
        })
        .catch(async _ => {
          const receipt = await dowsJSConnector.provider!.waitForTransaction(hash, 0)
          if (!receipt.status) {
            t.fail()
            dispatch(updateTransactionHistoryStatus(t))
          }
        })
    })
  }

  useEffect(() => {
    const bridgeTransactions: BridgeDows[] = transactionList.filter(t =>
      t.TYPE === TransactionHistoryImplementationClassType.Bridge
      && t.status !== TransactionStatus.Completed
      && t.status !== TransactionStatus.Failed
    ) as BridgeDows[]

    if (bridgeTransactions.length === 0) {
      return

    }
    const intervalId = setInterval(() => task(bridgeTransactions), 5000)

    return () => clearInterval(intervalId)
  }, [transactionList])
}

export function useListenBscTransaction() {
  const { forceRefresh } = useRefreshController()

  const dispatch = useDispatch()
  const transactionList = useSelector(getTransactionHistoryList)

  useEffect(() => {
    const transactionHistories: TransactionHistory[] = transactionList.filter(t =>
      t.TYPE !== TransactionHistoryImplementationClassType.Bridge
      && t.status !== TransactionStatus.Completed && t.status !== TransactionStatus.Failed
    )

    if (transactionHistories.length === 0) {
      return
    }

    transactionHistories.forEach(th => {
      dowsJSConnector.provider?.getTransaction(th.hash)
        .then(transaction => {
          transaction.wait().then(() => {
            th.complete()
            dispatch(updateTransactionHistoryStatus(th))
            forceRefresh()
          }).catch(() => {
            th.fail()
            dispatch(updateTransactionHistoryStatus(th))
          })
        })
    })
  }, [transactionList])
}

