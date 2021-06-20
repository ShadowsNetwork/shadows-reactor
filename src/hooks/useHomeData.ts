import { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import useDowsPriceQuery from '@/queries/useDowsPriceQuery'
import { addressAvailable, toBigNumber, toByte32, weiToBigNumber } from '@/web3/utils'
import BN from 'bn.js'
import BigNumber from 'bignumber.js'
import { useCurrencyData } from '@/hooks/useTradeData'
import { useRefreshController } from '@/contexts/RefreshControllerContext'

const useAssetsBalance = () => {
  const account = useSelector(getAccount
  )
  const { keyList } = useCurrencyData()

  const { data: dowsPrice } = useDowsPriceQuery()

  const { fastRefreshFlag } = useRefreshController()

  const [assetsBalanceList, setAssetsBalanceList] = useState<Array<{ key: string, quantity: BigNumber, value: BigNumber }>>([])

  const fetch = useCallback(async () => {
    if (!addressAvailable(account) || !dowsPrice) {
      return
    }

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
  }, [account, dowsPrice, keyList, fastRefreshFlag])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { assetsBalanceList }
}

const useBalance = () => {
  const account = useSelector(getAccount)
  const { data: dowsPrice } = useDowsPriceQuery()

  const [yourBalance, setYourBalance] = useState('')
  const [assetsBalance, setAssetsBalance] = useState('')
  const [debtPool, setDebtPool] = useState('')
  const [ratio, setRatio] = useState(toBigNumber(0.2))

  const { fastRefreshFlag } = useRefreshController()

  const fetch = useCallback(async () => {
    if (!account || !dowsPrice) {
      setYourBalance('')
      setAssetsBalance('')
      setDebtPool('')
      return
    }

    const [_balanceOf, _transferableShadows, _debtBalanceOf, _collateralisationRatio, _issuanceRatio] = (
      await Promise.all([
        dowsJSConnector.dowsJs.Shadows.balanceOf(account),
        dowsJSConnector.dowsJs.Synthesizer.transferableShadows(account),
        dowsJSConnector.dowsJs.Synthesizer.debtBalanceOf(account, toByte32('xUSD')),
        dowsJSConnector.dowsJs.Synthesizer.collateralisationRatio(account),
        dowsJSConnector.dowsJs.Synthesizer.issuanceRatio()
      ]))

    const rate = weiToBigNumber(_collateralisationRatio) > weiToBigNumber(_issuanceRatio) ? weiToBigNumber(_collateralisationRatio) : weiToBigNumber(_issuanceRatio)
    const [_newBalanceOf, _newTransferableShadows] = [_balanceOf, _transferableShadows]
      .map((value: BN) => weiToBigNumber(value))
      .map((value: BigNumber) =>
        value.multipliedBy(toBigNumber(dowsPrice))
          .toString()
      )

    // const _newDebtBalanceOf = weiToBigNumber(_debtBalanceOf)
    // .dividedBy(rate)
    // .multipliedBy(toBigNumber(dowsPrice)).toString()

    const _newDebtBalanceOf = weiToBigNumber(_debtBalanceOf).toString()
    // .dividedBy(rate)
    // .multipliedBy(toBigNumber(dowsPrice)).toString()

    setYourBalance(_newBalanceOf)
    setAssetsBalance(_newTransferableShadows)
    setDebtPool(_newDebtBalanceOf)
    setRatio(rate)

  }, [account, dowsPrice, fastRefreshFlag])

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
  const totalCurrentKeysBalance = assetsBalanceList.reduce((sum: BigNumber, item: any) => sum.plus(item.value), toBigNumber(0))
  return {
    yourBalance: totalCurrentKeysBalance.plus(toBigNumber(assetsBalance || 0)),
    dowsBalance: yourBalance,
    assetsBalance,
    debtPool,
    assetsBalanceList,
    netTradingBalance: totalCurrentKeysBalance.minus(toBigNumber(debtPool || 0))
  }
}
