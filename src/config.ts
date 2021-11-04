import { ConfigType } from '../config'

const config = process.env.CONTRACT_CONFIG as unknown as ConfigType

export default config
