import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

const request = axios.create({
  baseURL: 'http://122.51.71.147:3001',
  timeout: 30000
})

const useTradingDataQuery = (mode: string, currencyKey?: string) => {
  const [data, setData] = useState<any>()

  const fetch = useCallback(async () => {
    const key = currencyKey?.substr(1)
      .toLowerCase()

    let url = ''
    if (mode === 'price') {
      url = `/coingecko/${key}/price`
    } else if (mode === 'volume') {
      url = `/shadows/${key}/valume`
    } else if (mode === 'countmaxmin') {
      url = `/shadows/${key}/countmaxmin`
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
