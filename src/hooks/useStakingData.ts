import { useCallback, useEffect, useState } from 'react'
import { weiToBigNumber, weiToString } from '@/web3/utils'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import useDowsPriceQuery from '@/queries/useDowsPriceQuery'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { PoolType } from '@/types/LiquidityProvider'
import { useRefreshController } from '@/contexts/RefreshControllerContext'

const ALLOWANCE_THRESHOLD_VALUE = new BigNumber('2').pow(128)

function isAllowanceEnough(allowance: string): boolean {
  return new BigNumber(allowance).gt(ALLOWANCE_THRESHOLD_VALUE)
}

async function getAPY(
  account: string,
  lpTokenAddress: string,
  farmAddress: string,
  poolType: PoolType,
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

  const APR = rewardPerYear.dividedBy(staked)

  // (1 + APR / 12) ^ 12 - 1
  return (new BigNumber(1).plus(
    APR.dividedBy(12)
  )).pow(12)
    .minus(1)
    .multipliedBy(100)
    .toString(10)
}

export type PoolData = {
  totalLockedLP: string
  totalLockedLPInUSD: string
  APY: string
  userLpBalance: string
  userLockedLp: string
  userLockedLpInUSD: string
  dowsEarned: string
  allowanceEnough: boolean
}

type PoolDataProps = {
  lpTokenContractAddress: string,
  farmContractAddress: string,
  poolType: PoolType,
  poolNumber: number,
  lpMultiplier: number,
}

export const useStakingData = ({
  lpTokenContractAddress,
  farmContractAddress,
  poolType,
  poolNumber,
  lpMultiplier
}: PoolDataProps): PoolData => {
  const account = useSelector(getAccount)

  const dowsPrice = new BigNumber((useDowsPriceQuery().data as string))

  const { fastRefreshFlag } = useRefreshController()

  const [totalLockedLP, setTotalLockedLP] = useState('0')
  const [totalLockedLPInUSD, setTotalLockedLPInUSD] = useState('0')
  const [APY, setAPY] = useState('0')
  const [userLockedLp, setUserLockedLp] = useState('0')
  const [userLockedLpInUSD, setUserLockedLpInUSD] = useState('0')
  const [dowsEarned, setDowsEarned] = useState('0')
  const [allowanceEnough, setAllowanceEnough] = useState(false)
  const [userLpBalance, setUserLpBalance] = useState('')

  const fetchData = useCallback(async () => {
    if (!account) {
      setTotalLockedLP('0')
      setTotalLockedLPInUSD('0')
      setAPY('0')
      setUserLockedLpInUSD('0')
      setUserLockedLp('0')
      setDowsEarned('0')
      setUserLpBalance('0')
      return
    }

    const [_userLpBalance, _totalLockedLP, _userLockedLp, _dowsEarned, _lpTokenAllowance, _APY] = await Promise.all([
      dowsJSConnector.dowsJs.LpERC20Token.balanceOf(lpTokenContractAddress, account),
      dowsJSConnector.dowsJs.LpERC20Token.balanceOf(lpTokenContractAddress, farmContractAddress),
      dowsJSConnector.dowsJs.Farm.deposited(farmContractAddress, poolNumber, account),
      dowsJSConnector.dowsJs.Farm.pending(farmContractAddress, poolNumber, account),
      dowsJSConnector.dowsJs.LpERC20Token.allowance(lpTokenContractAddress, account, farmContractAddress),
      getAPY(account, lpTokenContractAddress, farmContractAddress, poolType, poolNumber, lpMultiplier)
    ])
    setUserLpBalance(weiToString(_userLpBalance))

    setTotalLockedLP(weiToString(_totalLockedLP))
    setTotalLockedLPInUSD(weiToBigNumber(_totalLockedLP)
      .multipliedBy(dowsPrice)
      .multipliedBy(lpMultiplier)
      .toFixed(2)
    )

    setUserLockedLp(weiToString(_userLockedLp))
    setUserLockedLpInUSD(weiToBigNumber(_userLockedLp)
      .multipliedBy(dowsPrice)
      .multipliedBy(lpMultiplier)
      .toFixed(2)
    )

    setDowsEarned(weiToBigNumber(_dowsEarned)
      .toFixed(2))

    setAllowanceEnough(isAllowanceEnough(weiToString(_lpTokenAllowance)))

    setAPY(_APY)
  }, [account, dowsPrice, fastRefreshFlag])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    totalLockedLP,
    totalLockedLPInUSD: totalLockedLPInUSD,
    APY,
    userLpBalance,
    userLockedLp,
    userLockedLpInUSD,
    dowsEarned,
    allowanceEnough
  }
}
