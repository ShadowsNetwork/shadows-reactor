import { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import { bytesToString, weiToBigNumber } from '@/web3/utils'
import BigNumber from 'bignumber.js'
import { useRefreshController } from '@/contexts/RefreshControllerContext'

export type KeyPair = {
  symbol: SymbolPair,
  lastPrice: string
}

export type PairData = {
  keyPairs?: KeyPair[]
  keyList: string[]
}

export type SymbolPair = [string, string]

export const useCurrencyData = (): PairData => {
  const [keyPairs, setKeyPairs] = useState<KeyPair[] | undefined>(undefined)
  const [currencyList, setKeyList] = useState<string[]>([])

  const fetch = useCallback(async () => {
    // ['xUSD', 'xAUD', 'xEUR', ...]
    const _keyList: Array<string> = (await dowsJSConnector.dowsJs.Synthesizer.availableCurrencyKeys()).map(k => bytesToString(k))

    // ['1.000000', '0.500000', '0.75000000', ...]
    const ratesList = (
      await Promise.all(
        _keyList.map(key => dowsJSConnector.dowsJs.Oracle.rateForCurrency(key))
      )
    ).map(rate => weiToBigNumber(rate))

    /**
     * {
     *   'xUSD' => '1.000000',
     *   'xAUD' => '0.500000',
     *   'xEUR' => '0.750000',
     *   ...
     * }
     */
    const keysByRate = new Map(_keyList.map((key, index) => [key, ratesList[index]]))

    const keysSet = new Set<string>(_keyList)
    keysSet.delete('xUSD')

    /**
     * Get key pair price by source key and target key.
     * @param sourceKey
     * @param targetKey
     */
    const pairPrice = (sourceKey: string, targetKey: string): string =>
      keysByRate.get(sourceKey)!
        .dividedBy(keysByRate.get(targetKey)!)
        .toFixed(6)

    /**
     * [
     *  { symbol: ['xAUD', 'xUSD'], lastPrice: '0.500000' },
     *  { symbol: ['xEUR', 'xUSD'], lastPrice: '1.250000' },
     *  ...
     * ]
     */
    const _keyPairs = Array.from(keysSet)
      .map<KeyPair>(
        key => ({
          symbol: [key, 'xUSD'],
          lastPrice: pairPrice(key, 'xUSD')
        })
      )

    setKeyList(_keyList)
    setKeyPairs(_keyPairs)
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return {
    keyPairs,
    keyList: currencyList
  }
}

export const useCurrencyBalance = () => {
  const { keyList } = useCurrencyData()
  const account = useSelector(getAccount)
  const [balanceByCurrency, setBalanceByCurrency] = useState<{ [key: string]: BigNumber }>({})
  const { fastRefreshFlag } = useRefreshController()

  const fetchBalance = useCallback(async () => {
    if (keyList.length > 0 && account) {
      let balanceList = await Promise.all(
        keyList.map(key => dowsJSConnector.dowsJs.Synth.balanceOf(key, account))
      )

      balanceList = balanceList.map(v => weiToBigNumber(v)) as BigNumber[]

      const _balanceByCurrency = {}
      keyList.forEach((key, index) => {
        _balanceByCurrency[key] = balanceList[index]
      })

      setBalanceByCurrency(_balanceByCurrency)
    }
  }, [keyList, fastRefreshFlag, account])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return {
    balanceByCurrency,
  }
}
