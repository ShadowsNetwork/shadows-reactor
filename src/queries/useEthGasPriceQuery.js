import axios from 'axios';
import { useQuery } from 'react-query';
const ETH_GAS_STATION_API_URL = 'https://ethgasstation.info/json/ethgasAPI.json';
const GAS_NOW_API_URL = 'https://www.gasnow.org/api/v3/gas/price?utm_source=shadows';
const useEthGasPriceQuery = () => {
    return useQuery('GAS_PRICE', async () => {
        try {
            const result = await axios.get(GAS_NOW_API_URL);
            const { standard, fast, rapid: fastest } = result.data.data;
            return {
                fastest: Math.round(fastest / 1e8 / 10),
                fast: Math.round(fast / 1e8 / 10),
                average: Math.round(standard / 1e8 / 10),
            };
        }
        catch (e) {
            console.log(e);
            const result = await axios.get(ETH_GAS_STATION_API_URL);
            const { average, fast, fastest } = result.data;
            return {
                fastest: Math.round(fastest / 10),
                fast: Math.round(fast / 10),
                average: Math.round(average / 10),
            };
        }
    });
};
export default useEthGasPriceQuery;
//# sourceMappingURL=useEthGasPriceQuery.js.map