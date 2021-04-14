/*
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { web3Utils } from '@/web3/utils'
import { dateFormat } from '@/utils/index'

type BitQueryResponseTransaction = {
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
      transactions: BitQueryResponseTransaction[]
    }
  }
}

const network = 'bsc_testnet'

const BIT_QUERY_API_URL = 'https://graphql.bitquery.io/'

const BIT_QUERY_API_KEY = 'BQYVvicBeQSNtRIBMz5TMEdgSw9FsOAc'

export default async function getBscGasPrice(): Promise<string> {
  const today = dateFormat(new Date(), 'yyyy-MM-dd')

  const body = {
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
  const response = await fetch(
    BIT_QUERY_API_URL,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
        'X-API-KEY': BIT_QUERY_API_KEY
      },
      body: JSON.stringify(body),
      credentials: 'same-origin',
      mode: 'no-cors'
    },
  )
  const result = await response
  console.log(result)
  const gwei = new BigNumber(response.body.data.ethereum.transactions[0].gasPrice.toString()).toFixed(0)
  return web3Utils.toWei(gwei, 'gwei').toString()
}
*/
