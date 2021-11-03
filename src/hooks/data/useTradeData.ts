import { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { addressAvailable, bytesToString, weiToBigNumber } from '@/web3/utils'
import BigNumber from 'bignumber.js'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'
import { shadowsSynthsConfig } from '@/config/img.config'
import { useQuery } from 'react-query'
import { UseQueryResult } from 'react-query/types/react/types'
import { useWeb3React } from '@web3-react/core'

export type KeyPair = {
  symbol: SymbolPair,
  lastPrice: string
}

export type PairData = {
  keyPairs?: KeyPair[]
  keyList: string[]
}

export type SymbolPair = [string, string]

export type BalanceByCurrency = { [key: string]: BigNumber }

export const useCurrencyData = () => {
  const { networkReady, providerReady } = useWeb3EnvContext()

  return useQuery(['CURRENCY_DATA', networkReady, providerReady], async () => {
    if (!providerReady) {
      return
    }

    // ['xUSD', 'xAUD', 'xEUR', ...]
    const keyList: Array<string> = (await dowsJSConnector.dowsJs.Synthesizer.availableCurrencyKeys()).map(k => bytesToString(k))

    // ['1.000000', '0.500000', '0.75000000', ...]
    const ratesList = (
      await Promise.all(
        keyList.map(key => dowsJSConnector.dowsJs.Oracle.rateForCurrency(key))
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
    const keysByRate = new Map(keyList.map((key, index) => [key, ratesList[index]]))

    const keysSet = new Set<string>(keyList)
    keysSet.delete('ShaUSD')

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
    const _pairs: KeyPair[] = []
    Array.from(keysSet).forEach((key: string) => {
      const _index = shadowsSynthsConfig.findIndex(item => item.symbol === key)
      _pairs[_index] = {
        symbol: [key, 'ShaUSD'],
        lastPrice: pairPrice(key, 'ShaUSD')
      }
    })
    const keyPairs = _pairs.filter(item => !!item)
    return {
      keyPairs,
      keyList
    }
  })
}

export const useCurrencyBalance = (): UseQueryResult<BalanceByCurrency> => {
  const { account } = useWeb3React()
  const { data: currencyData } = useCurrencyData()
  const { fastRefreshFlag } = useRefreshController()
  const { networkReady } = useWeb3EnvContext()

  return useQuery<BalanceByCurrency>(
    ['CURRENCY_BALANCE', currencyData, fastRefreshFlag, account, networkReady],
    async () => {
      if (!networkReady || !addressAvailable(account) || !currencyData) {
        return {} as BalanceByCurrency
      }

      const { keyList } = currencyData
      const balanceByCurrency: BalanceByCurrency = {}

      if (keyList.length > 0 && account) {
        let balanceList = await Promise.all(
          keyList.map(key => dowsJSConnector.dowsJs.Synth.balanceOf(key, account))
        )

        balanceList = balanceList.map(v => weiToBigNumber(v)) as BigNumber[]

        keyList.forEach((key, index) => {
          balanceByCurrency[key] = balanceList[index]
        })
      }

      return balanceByCurrency
    }
  )
}

export const useCurrencyPrice = (name?: string) => {
  const [currentPrice, setCurrentPrice] = useState<string>('')

  const getPrice = useCallback(async () => {
    if (name) {
      const rage = await dowsJSConnector.dowsJs.Oracle.rateForCurrency(name)
      setCurrentPrice(weiToBigNumber(rage).toString())
    }
  }, [name])

  useEffect(() => {
    getPrice()
  }, [getPrice])

  return {
    currentPrice
  }
}
