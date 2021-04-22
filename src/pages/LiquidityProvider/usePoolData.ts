import { useCallback, useEffect, useState } from 'react'
import { fromWei } from '@/web3/utils'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import useDowsPriceQuery from '@/queries/useDowsPriceQuery'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'

const ALLOWANCE_THRESHOLD_VALUE = new BigNumber('2').pow(128)

const isAllowanceEnough = (allowance: string): boolean => {
  return new BigNumber(allowance).gt(ALLOWANCE_THRESHOLD_VALUE)
}

const getCurrentAPR = async (lpTokenAddress: string) => {
  const lp_to_dows = new BigNumber('33.22443529339985')

  const totalSupply = new BigNumber(fromWei(await dowsJSConnector.dowsJs.LpERC20Token.totalSupply(lpTokenAddress)))

  const totalDows = lp_to_dows.multipliedBy(totalSupply)

  return `${new BigNumber('4.5e6').dividedBy(totalDows)
    .multipliedBy('1e2')
    .toFixed(2)} %`
}

export type PoolData = {
  lpBalance: string
  lpBalanceInUSD: string
  currentAPR: string
  userLockedLp: string
  userLockedLpInUSD: string
  dowsEarned: string
  allowanceEnough: boolean
}

type PoolDataProps = {
  lpTokenContractAddress: string,
  farmContractAddress: string,
  poolNumber: number,
  refreshFlag: number
}

export const usePoolData = ({
  lpTokenContractAddress,
  farmContractAddress,
  poolNumber,
  refreshFlag
}: PoolDataProps): PoolData => {
  const account = useSelector(getAccount)
  const dowsPrice = new BigNumber((useDowsPriceQuery().data as string))

  const [lpBalance, setLpBalance] = useState('0')
  const [lpBalanceInUSD, setLpBalanceInUSD] = useState('0')
  const [currentAPR, setCurrentAPR] = useState('0')
  const [userLockedLp, setUserLockedLp] = useState('0')
  const [userLockedLpInUSD, setUserLockedLpInUSD] = useState('0')
  const [dowsEarned, setDowsEarned] = useState('0')
  const [allowanceEnough, setAllowanceEnough] = useState(false)

  const fetchData = useCallback(async () => {
    if (!account) {
      setLpBalance('0')
      setLpBalanceInUSD('0')
      setCurrentAPR('0')
      setUserLockedLpInUSD('0')
      setUserLockedLp('0')
      setDowsEarned('0')
      return
    }

    const [balance, deposited, pending, lpTokenAllowance, currentAPR] = await Promise.all([
      dowsJSConnector.dowsJs.LpERC20Token.balanceOf(lpTokenContractAddress, account),
      dowsJSConnector.dowsJs.Farm.deposited(farmContractAddress, poolNumber, account),
      dowsJSConnector.dowsJs.Farm.pending(farmContractAddress, poolNumber, account),
      dowsJSConnector.dowsJs.LpERC20Token.allowance(lpTokenContractAddress, account, farmContractAddress),
      getCurrentAPR(lpTokenContractAddress)
    ])
    setLpBalance(fromWei(balance))
    setLpBalanceInUSD(new BigNumber(lpBalance).multipliedBy(dowsPrice)
      .toFixed(2))

    setUserLockedLp(fromWei(deposited))
    setUserLockedLpInUSD(new BigNumber(userLockedLp).multipliedBy(dowsPrice)
      .toFixed(2))

    setDowsEarned(new BigNumber(fromWei(pending)).toFixed(2))

    setAllowanceEnough(isAllowanceEnough(fromWei(lpTokenAllowance)))

    setCurrentAPR(currentAPR)
  }, [account, dowsPrice, refreshFlag])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    lpBalance,
    lpBalanceInUSD,
    currentAPR,
    userLockedLp,
    userLockedLpInUSD,
    dowsEarned,
    allowanceEnough
  }
}
