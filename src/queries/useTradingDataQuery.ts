import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

import { ConfigType } from '../../config'
const config = process.env.CONTRACT_CONFIG as unknown as ConfigType

const request = axios.create({
  baseURL: config.baseUrl,
  timeout: 30000
})

const useTradingDataQuery = (mode: string, currencyKey?: string) => {
  const [data, setData] = useState<any>()

  const fetch = useCallback(async () => {
    const key = currencyKey?.substr(1)
      .toLowerCase()

    let url = ''
    if (mode === 'price') {
      url = `/price/${key}`
    } else if (mode === 'volume') {
      url = `/shadows/${key}/valume`
    } else if (mode === 'countmaxmin') {
      url = `/price/${key}/countmaxmin`
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
