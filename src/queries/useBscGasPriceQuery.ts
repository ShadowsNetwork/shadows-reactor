/*
import axios from 'axios'
import { useQuery } from 'react-query'
import { UseQueryResult } from 'react-query/types/react/types'
import { dateFormat } from '@/utils'
import { web3Utils } from '@/web3/utils'
import BigNumber from 'bignumber.js'

const BIT_QUERY_API_URL = 'https://graphql.bitquery.io/'

type Transaction = {
  date: {
    date: string
  },
  gasPrice: string,
  gasValue: string,
  average: string,
  maxGasPrice: string,
  mediumGasPrice: string,
}

type BitQueryResponse = {
  data: {
    ethereum: {
      transactions: Transaction[]
    }
  }
}

const useBscGasPriceQuery = (): UseQueryResult => {
  const today = dateFormat(new Date(), 'yyyy-MM-dd')

  const network = 'bsc_testnet'
  return useQuery<string>(
    'BSC_GAS_PRICE',
    async () => {
      const data = {
        query: `query ($network: EthereumNetwork!, $dateFormat: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
                  ethereum(network: $network) {
                    transactions(options: {asc: "date.date"}, date: {since: $from, till: $till}) {
                      date: date {
                        date(format: $dateFormat)
                      }
                      gasPrice
                      gasValue
                      average: gasValue(calculate: average)
                      maxGasPrice: gasPrice(calculate: maximum)
                      medianGasPrice: gasPrice(calculate: median)
                    }
                  }
                }
                `,
        variables: {
          limit: 1,
          offset: 0,
          network,
          from: today,
          till: today,
          dateFormat: '%Y-%m-%d'
        }
      }
      const result = await axios.post<BitQueryResponse>(BIT_QUERY_API_URL, data)
      const gwei = new BigNumber(result.data.data.ethereum.transactions[0].gasPrice.toString()).toFixed(0)
      return web3Utils.toWei(gwei, 'gwei').toString()
    }
  )
}

export default useBscGasPriceQuery
*/
