import { addressAvailable, weiToBigNumber, weiToString } from '@/web3/utils'
import BigNumber from 'bignumber.js'
import useDowsPrice from '@/queries/useDowsPrice'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'
import { useQuery } from 'react-query'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import { UseQueryResult } from 'react-query/types/react/types'
import { useWeb3React } from '@web3-react/core'

type PoolDataProps = {
  lpTokenContractAddress: string,
  farmContractAddress: string,
  poolNumber: number,
  lpMultiplier: number,
}

const ALLOWANCE_THRESHOLD_VALUE = new BigNumber('2').pow(128)

function isAllowanceEnough(allowance: string): boolean {
  return new BigNumber(allowance).gt(ALLOWANCE_THRESHOLD_VALUE)
}

async function getAPY(
  lpTokenAddress: string,
  farmAddress: string,
  poolNumber: number,
  lpMultiplier: number
): Promise<string> {
  const [_rewardPerBlock, _BONUS_MULTIPLIER, _staked, _poolInfo, _totalAllocPoint] = await Promise.all([
    dowsJSConnector.dowsJs.Farm.rewardPerBlock(farmAddress),
    dowsJSConnector.dowsJs.Farm.multiplier(farmAddress),
    dowsJSConnector.dowsJs.LpERC20Token.balanceOf(lpTokenAddress, farmAddress),
    dowsJSConnector.dowsJs.Farm.poolInfo(farmAddress, poolNumber),
    dowsJSConnector.dowsJs.Farm.totalAllocPoint(farmAddress)
  ])
  const rewardPerBlock = weiToBigNumber(_rewardPerBlock)

  const BONUS_MULTIPLIER = _BONUS_MULTIPLIER.toString()

  const staked = weiToBigNumber(_staked)
    .multipliedBy(lpMultiplier)

  if (staked.eq(0)) {
    return '0'
  }

  const allocPoint = _poolInfo.allocPoint.toString()

  const totalAllocPoint = _totalAllocPoint.toString()

  const rewardPerYear = rewardPerBlock.multipliedBy(BONUS_MULTIPLIER)
    .multipliedBy(allocPoint)
    .dividedBy(totalAllocPoint)
    .multipliedBy('10368000')

  return rewardPerYear.dividedBy(staked)
    .multipliedBy(100)
    .toString(10)
}

type StakingPoolPublicData = {
  totalLockedLP?: string
  totalLockedLPInUSD?: string
  apy?: string
}

type StakingPoolPrivateData = {
  userLpBalance?: string
  userLockedLp?: string
  userLockedLpInUSD?: string
  dowsEarned?: string
  allowanceEnough?: boolean
}

export type PoolData = StakingPoolPrivateData & StakingPoolPublicData

const useStakingPoolPublicData = (props: PoolDataProps): UseQueryResult<StakingPoolPublicData> => {
  const {
    lpTokenContractAddress,
    farmContractAddress,
    poolNumber,
    lpMultiplier
  } = props

  const dowsPrice = useDowsPrice()
  const { providerReady } = useWeb3EnvContext()
  const { quietRefreshFlag } = useRefreshController()

  return useQuery<StakingPoolPublicData>(
    ['STAKING_POOL_PUBLIC_DATA', dowsPrice, providerReady, lpMultiplier, lpTokenContractAddress, farmContractAddress, poolNumber, quietRefreshFlag],
    async () => {
      if (!providerReady || !dowsPrice) {
        return {}
      }

      let priceBase = dowsPrice
      if (poolNumber===2) {
        priceBase = new BigNumber(1)
      }

      const [_totalLockedLP, _apy] = await Promise.all([
        dowsJSConnector.dowsJs.LpERC20Token.balanceOf(lpTokenContractAddress, farmContractAddress),
        getAPY(lpTokenContractAddress, farmContractAddress, poolNumber, lpMultiplier)
      ])

      return {
        totalLockedLP: weiToString(_totalLockedLP),
        totalLockedLPInUSD: weiToBigNumber(_totalLockedLP)
          .multipliedBy(priceBase)
          .multipliedBy(lpMultiplier)
          .toFixed(2),
        apy: _apy
      }
    }
  )
}

const useStakingPoolPrivateData = (props: PoolDataProps): UseQueryResult<StakingPoolPrivateData> => {
  const {
    lpTokenContractAddress,
    farmContractAddress,
    poolNumber,
    lpMultiplier
  } = props

  const { account } = useWeb3React()
  const dowsPrice = useDowsPrice()
  const { providerReady } = useWeb3EnvContext()
  const { quietRefreshFlag } = useRefreshController()

  return useQuery<StakingPoolPrivateData>(
    ['STAKING_POOL_PRIVATE_DATA', account, dowsPrice, providerReady, lpTokenContractAddress, lpMultiplier, poolNumber, farmContractAddress, quietRefreshFlag],
    async () => {
      if (!providerReady || !dowsPrice || !addressAvailable(account)) {
        return {}
      }

      const [_userLpBalance, _userLockedLp, _dowsEarned, _lpTokenAllowance] = await Promise.all([
        dowsJSConnector.dowsJs.LpERC20Token.balanceOf(lpTokenContractAddress, account!),
        dowsJSConnector.dowsJs.Farm.deposited(farmContractAddress, poolNumber, account),
        dowsJSConnector.dowsJs.Farm.pending(farmContractAddress, poolNumber, account),
        dowsJSConnector.dowsJs.LpERC20Token.allowance(lpTokenContractAddress, account!, farmContractAddress)
      ])
      
      let priceBase = dowsPrice
      if (poolNumber===2) {
        priceBase = new BigNumber(1)
      }

      return {
        userLpBalance: weiToString(_userLpBalance),
        userLockedLp: weiToString(_userLockedLp),
        userLockedLpInUSD: weiToBigNumber(_userLockedLp)
          .multipliedBy(priceBase)
          .multipliedBy(lpMultiplier)
          .toFixed(2),
        dowsEarned: weiToBigNumber(_dowsEarned)
          .toFixed(2),
        allowanceEnough: isAllowanceEnough(weiToString(_lpTokenAllowance))
      }
    }
  )
}

export const useStakingData = (props: PoolDataProps): PoolData => {
  return {
    ...useStakingPoolPublicData(props).data,
    ...useStakingPoolPrivateData(props).data
  }
}
