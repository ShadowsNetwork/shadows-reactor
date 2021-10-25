import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

import { ConfigType } from '../../config'
const config = process.env.CONTRACT_CONFIG as unknown as ConfigType

const request = axios.create({
  baseURL: config.baseUrl,
  timeout: 30000
})

const filterKey = ['coinbase', 'silver', 'gold']

const useTradingDataQuery = (mode: string, currencyKey?: string) => {
  const [data, setData] = useState<any>()

  const fetch = useCallback(async () => {
    const key = currencyKey?.replace(/^(sha)|x/i, '')
      .toLowerCase()
    const isBool = key && !filterKey.includes(key)

    let url = ''
    if (mode === 'price') {
      url = isBool ? `/price/${key}` : `/coingecko/${key}/price`
    } else if (mode === 'volume') {
      url = `/shadows/${key}/valume`
    } else if (mode === 'countmaxmin') {
      url = isBool ? `/price/${key}/countmaxmin` : `/coingecko/${key}/countmaxmin`
    }

    if (!currencyKey || !url) {
      return
    }

    const result = (await request.get(url)).data

    setData(result)
  }, [currencyKey, mode])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data }
}

export default useTradingDataQuery
