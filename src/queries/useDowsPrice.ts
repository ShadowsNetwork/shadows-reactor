import { useQuery } from 'react-query'
import axios from 'axios'
import BigNumber from 'bignumber.js'

const useDowsPrice = (): BigNumber | undefined => {
  const { data } = useQuery<string | number>('DOWS_PRICE', async () => {
    const result = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=shadows&vs_currencies=usd')
    return result.data['shadows']['usd']
  })

  return data ? new BigNumber(data) : undefined
}

export default useDowsPrice
