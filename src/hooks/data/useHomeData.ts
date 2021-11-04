import { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import useDowsPrice from '@/queries/useDowsPrice'
import { addressAvailable, toBigNumber, toByte32, weiToBigNumber } from '@/web3/utils'
import BN from 'bn.js'
import BigNumber from 'bignumber.js'
import { useCurrencyData } from '@/hooks/data/useTradeData'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'
import { useWeb3React } from '@web3-react/core'

const useAssetsBalance = () => {
  const { account } = useWeb3React()

  const { data: currencyData } = useCurrencyData()

  const { slowRefreshFlag } = useRefreshController()

  const [assetsBalanceList, setAssetsBalanceList] = useState<Array<{ key: string, quantity: BigNumber, value: BigNumber }>>([])

  const { providerReady, networkReady } = useWeb3EnvContext()

  const fetch = useCallback(async () => {
    if (!addressAvailable(account) || !providerReady || !networkReady || !currencyData) {
      setAssetsBalanceList([])
      return
    }

    const { keyList } = currencyData

    if (keyList.length > 0 && account) {
      const balanceList: BN[] = await Promise.all(keyList.map(key => dowsJSConnector.dowsJs.Synth.balanceOf(key, account)))
      const rates = await Promise.all(keyList.map(key => dowsJSConnector.dowsJs.Oracle.rateForCurrency(key)))

      const rateByCurrencyKey = []
      rates.map(v => weiToBigNumber(v)).forEach((rate: BigNumber, index) => {
        rateByCurrencyKey[keyList[index]] = rate
      })

      setAssetsBalanceList(
        balanceList
          .map(v => weiToBigNumber(v))
          .map((balance, index) => {
            return ({
              key: keyList[index],
              quantity: balance,
              value: balance.multipliedBy(rateByCurrencyKey[keyList[index]])
            })
          })
          .filter(v => v.quantity.gt(0))
      )
    }
  }, [account, currencyData, slowRefreshFlag, providerReady, networkReady])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { assetsBalanceList }
}

const useBalance = () => {
  const { account } = useWeb3React()
  const dowsPrice = useDowsPrice()

  const [yourBalance, setYourBalance] = useState('')
  const [assetsBalance, setAssetsBalance] = useState('')
  const [debtPool, setDebtPool] = useState('')

  const { fastRefreshFlag } = useRefreshController()
  const { providerReady, networkReady } = useWeb3EnvContext()

  const fetch = useCallback(async () => {
    if (!account || !dowsPrice || !providerReady || !networkReady) {
      setYourBalance('')
      setAssetsBalance('')
      setDebtPool('')
      return
    }

    const [_balanceOf, _transferableShadows, _debtBalanceOf] = (
      await Promise.all([
        dowsJSConnector.dowsJs.Shadows.balanceOf(account),
        dowsJSConnector.dowsJs.Synthesizer.transferableShadows(account),
        dowsJSConnector.dowsJs.Synthesizer.debtBalanceOf(account, toByte32('ShaUSD')),
      ]))

    const [_newBalanceOf, _newTransferableShadows] = [_balanceOf, _transferableShadows]
      .map((value: BN) => weiToBigNumber(value))
      .map((value: BigNumber) =>
        value.multipliedBy(dowsPrice).toString()
      )
    const _newDebtBalanceOf = weiToBigNumber(_debtBalanceOf).toString()

    setYourBalance(_newBalanceOf)
    setAssetsBalance(_newTransferableShadows)
    setDebtPool(_newDebtBalanceOf)

  }, [account, dowsPrice, fastRefreshFlag, providerReady, networkReady])

  useEffect(() => {
    fetch()
  }, [fetch])

  return {
    yourBalance, assetsBalance, debtPool
  }
}

export const useHomeData = () => {
  const { assetsBalanceList } = useAssetsBalance()
  const { yourBalance, assetsBalance, debtPool } = useBalance()

  const totalCurrentBalance = assetsBalanceList.reduce((sum: BigNumber, item: any) => sum.plus(item.value), toBigNumber(0))

  return {
    yourBalance: toBigNumber(yourBalance || 0).plus(totalCurrentBalance.minus(toBigNumber(debtPool || 0))),
    dowsBalance: yourBalance,
    assetsBalance,
    debtPool,
    assetsBalanceList,
    netTradingBalance: totalCurrentBalance.minus(toBigNumber(debtPool || 0))
  }
}
