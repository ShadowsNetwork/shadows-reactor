import { useCallback, useEffect, useState } from 'react'
import { weiToBigNumber, weiToString } from '@/web3/utils'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import useDowsPriceQuery from '@/queries/useDowsPriceQuery'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { PoolType } from '@/types/LiquidityProvider'

const ALLOWANCE_THRESHOLD_VALUE = new BigNumber('2').pow(128)

const isAllowanceEnough = (allowance: string): boolean => {
  return new BigNumber(allowance).gt(ALLOWANCE_THRESHOLD_VALUE)
}

const getAPY = async (account: string, lpTokenAddress: string, farmAddress: string, poolType: PoolType) => {
  const rewardPerBlock = weiToBigNumber(
    await dowsJSConnector.dowsJs.Farm.rewardPerBlock(farmAddress)
  )

  const staked = weiToBigNumber(
    await dowsJSConnector.dowsJs.LpERC20Token.balanceOf(lpTokenAddress, farmAddress)
  )

  const rewardPerYear = rewardPerBlock.multipliedBy('10512000')

  const APR = rewardPerYear.dividedBy(staked)
    .dividedBy(poolType === 'pair' ? '2.0' : '1.0')

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
  refreshFlag: number
}

export const usePoolData = ({
  lpTokenContractAddress,
  farmContractAddress,
  poolType,
  poolNumber,
  refreshFlag
}: PoolDataProps): PoolData => {
  const account = useSelector(getAccount)
  const dowsPrice = new BigNumber((useDowsPriceQuery().data as string))

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
      getAPY(account, lpTokenContractAddress, farmContractAddress, poolType)
    ])
    setUserLpBalance(weiToString(_userLpBalance))

    setTotalLockedLP(weiToString(_totalLockedLP))
    setTotalLockedLPInUSD(weiToBigNumber(_totalLockedLP)
      .multipliedBy(dowsPrice)
      .multipliedBy(poolType === 'pair' ? 2 : 1)
      .toFixed(2)
    )

    setUserLockedLp(weiToString(_userLockedLp))
    setUserLockedLpInUSD(weiToBigNumber(_userLockedLp)
      .multipliedBy(dowsPrice)
      .multipliedBy(poolType === 'pair' ? 2 : 1)
      .toFixed(2)
    )

    setDowsEarned(weiToBigNumber(_dowsEarned).toFixed(2))

    setAllowanceEnough(isAllowanceEnough(weiToString(_lpTokenAllowance)))

    setAPY(_APY)
  }, [account, dowsPrice, refreshFlag])

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
