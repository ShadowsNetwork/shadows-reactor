import { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import useDowsPriceQuery from '@/queries/useDowsPriceQuery'
import { toBigNumber, toByte32, weiToBigNumber } from '@/web3/utils'
import BN from 'bn.js'
import { usePairData } from '@/pages/Trade/TradeDataHooks'
import { useFetch } from '@/hooks'
import BigNumber from 'bignumber.js'

export const useHomeData = () => {
  const account = useSelector(getAccount)
  const { keyList } = usePairData()
  const { data: dowsPrice } = useDowsPriceQuery()

  const [yourBalance, setYourBalance] = useState('')
  const [assetsBalance, setAssetsBalance] = useState('')
  const [debtPool, setDebtPool] = useState('')
  const [assetsBalanceList, setAssetsBalanceList] = useState<Array<{ key: string, quantity: BigNumber, value: BigNumber }>>([])

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
      .map(value => value.multipliedBy(toBigNumber(dowsPrice))
        .toString())

    setYourBalance(_balanceOf)
    setAssetsBalance(_transferableShadows)
    setDebtPool(_debtBalanceOf)
    /*
    console.log(lines);
    const coinArr = ['USDT', 'BTC', 'ETH'];
    const ratesForCurrencies = await read('Oracle', {}, 'ratesForCurrencies', coinArr.map(item => toBytes32(item)))
    ratesForCurrencies.map((item, index) => {
      console.log(`Asset : ${coinArr[index]}, Qty: 0, Value: $${fromUnit(item.toString())}`)
    });*/
  }, [account, dowsPrice])

  useEffect(() => {
    fetch()
  }, [])

  useFetch(async () => {
    if (!account || !dowsPrice) {
      return
    }

    if (keyList.length > 0 && account) {
      const balanceList = await Promise.all(keyList.map(key => dowsJSConnector.dowsJs.Synth.balanceOf(key, account)))

      setAssetsBalanceList(
        balanceList.map((balance, index) => ({
          key: keyList[index],
          quantity: weiToBigNumber(balance),
          value: toBigNumber(dowsPrice).multipliedBy(weiToBigNumber(balance))
        }))
      )
    }
  }, [keyList, account])

  return {
    yourBalance,
    assetsBalance,
    debtPool,
    assetsBalanceList
  }
}
