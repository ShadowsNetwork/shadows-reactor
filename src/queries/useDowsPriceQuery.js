import { useQuery } from 'react-query';
import axios from 'axios';
const useDowsPriceQuery = () => {
    return useQuery('DOWS_PRICE', async () => {
        const result = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=shadows&vs_currencies=usd');
        return result.data['shadows']['usd'];
    });
};
export default useDowsPriceQuery;
//# sourceMappingURL=useDowsPriceQuery.js.map