import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

const useTradingDataQuery = (mode: string, currencyKey?: string) => {
  const [data, setData] = useState<any>()

  const fetch = useCallback(async () => {
    const key = currencyKey?.substr(1).toLowerCase()

    let url = ''
    if (mode === 'price') {
      url = `http://122.51.71.147:3001/coingecko/${key}/price`
      // url = 'http://122.51.71.147:3001/coingecko/btc/price'
    } else if (mode === 'volume') {
      url = `http://122.51.71.147:3001/shadows/${key}/valume`
    } else if (mode ===' countmaxmin' ) {
      url = `http://122.51.71.147:3001/shadows/${key}/countmaxmin`
    }

    if (!currencyKey) {
      return
    }

    const result = (await axios.get(url)).data

    setData(result)
  }, [currencyKey, mode])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data }
}

export default useTradingDataQuery
