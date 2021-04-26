import { useQuery } from 'react-query'
import axios from 'axios'
import { UseQueryResult } from 'react-query/types/react/types'

const useDowsPriceQuery = (): UseQueryResult<string | number> => {
  return useQuery<string | number>('DOWS_PRICE', async () => {
    const result = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=shadows&vs_currencies=usd')
    return result.data['shadows']['usd']
  })
}

export default useDowsPriceQuery
