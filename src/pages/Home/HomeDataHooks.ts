import { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import useDowsPriceQuery from '@/queries/useDowsPriceQuery'
import { toBigNumber, toByte32, weiToBigNumber } from '@/web3/utils'
import BN from 'bn.js'
import { usePairData } from '@/pages/Trade/TradeDataHooks'
import BigNumber from 'bignumber.js'

const useAssetsBalance = () => {
  const account = useSelector(getAccount)
  const { keyList } = usePairData()
  const { data: dowsPrice } = useDowsPriceQuery()

  const [assetsBalanceList, setAssetsBalanceList] = useState<Array<{ key: string, quantity: BigNumber, value: BigNumber }>>([])

  const fetch = useCallback(async () => {
    if (!account || !dowsPrice) {
      return
    }

    if (keyList.length > 0 && account) {
      const balanceList: BN[] = await Promise.all(keyList.map(key => dowsJSConnector.dowsJs.Synth.balanceOf(key, account)))
      const rates = await Promise.all(keyList.map(key => dowsJSConnector.dowsJs.Oracle.rateForCurrency(key)))

      const rateByCurrencyKey = []
      rates.map(v => weiToBigNumber(v)).forEach((rate: BigNumber, index) => {
        rateByCurrencyKey[keyList[index]] = rate
      })

      // DOWS / xUSD
      // const rateForDows = weiToBigNumber(await dowsJSConnector.dowsJs.Oracle.rateForCurrency('DOWS'))

      setAssetsBalanceList(
        balanceList
          .map(v => weiToBigNumber(v))
          .map((balance, index) => {
            return ({
              key: keyList[index],
              quantity: balance,
              // TODO
              value: new BigNumber(0)
              // value: balance.multipliedBy(rateForDows).multipliedBy(rateByCurrencyKey[keyList[index]]).multipliedBy(new BigNumber(dowsPrice))
            })
          })
          .filter(v => v.quantity.gt(0))
      )
    }
  }, [account, dowsPrice, keyList])

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

  const fetch = useCallback(async () => {
    if (!account || !dowsPrice) {
      return
    }

    const [_balanceOf, _transferableShadows, _debtBalanceOf] = (
      await Promise.all([
        dowsJSConnector.dowsJs.Shadows.balanceOf(account),
        dowsJSConnector.dowsJs.Synthesizer.transferableShadows(account),
        dowsJSConnector.dowsJs.Synthesizer.debtBalanceOf(account, toByte32('DOWS'))
      ]))
      .map((value: BN) => weiToBigNumber(value))
      .map((value: BigNumber) =>
        value.multipliedBy(toBigNumber(dowsPrice))
          .toString()
      )

    setYourBalance(_balanceOf)
    setAssetsBalance(_transferableShadows)
    setDebtPool(_debtBalanceOf)
  }, [account, dowsPrice])

  useEffect(() => {
    fetch()
  }, [])

  return {
    yourBalance, assetsBalance, debtPool
  }
}

export const useHomeData = () => {
  const { assetsBalanceList } = useAssetsBalance()

  const { yourBalance, assetsBalance, debtPool } = useBalance()

  return {
    yourBalance,
    assetsBalance,
    debtPool,
    assetsBalanceList
  }
}
