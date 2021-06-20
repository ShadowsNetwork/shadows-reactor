import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import { useCallback, useEffect, useState } from 'react'
import { utc } from 'moment'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { numberWithCommas } from '@/utils'
import BigNumber from 'bignumber.js'
import { addressAvailable, weiToBigNumber } from '@/web3/utils'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'
import { ContactsOutlined } from '@ant-design/icons'

interface FeePoolData {
  totalFees: BigNumber
  redeemableFees: BigNumber
  totalRewards: BigNumber
  escrowedRewards: BigNumber
  redeemableRewards: BigNumber,
  nextVestTime: string,
  vestingScheduleTime: BigNumber
}

interface TradeData extends FeePoolData {
  myRatio: string,
  targetRatio: string,

  totalDows: BigNumber,
  availableDows: BigNumber,
  lockedDows: BigNumber,
}

const useRatioData = (refreshFlag: number): { myRatio: string, targetRatio: string } => {
  const account = useSelector(getAccount)

  const { networkReady } = useWeb3EnvContext()

  const [myRatio, setMyRatio] = useState('-')
  const [targetRatio, setTargetRatio] = useState('-')

  const fetchRatio = useCallback(async () => {
    if (!networkReady || !addressAvailable(account)) {
      return
    }

    const [_collateralisationRatio, _issuanceRatio] = await Promise.all([
      dowsJSConnector.dowsJs.Synthesizer.collateralisationRatio(account),
      dowsJSConnector.dowsJs.Synthesizer.issuanceRatio()
    ])

    setMyRatio(
      _collateralisationRatio.isZero()
        ? '-'
        : `${numberWithCommas(new BigNumber('100').dividedBy(weiToBigNumber(_collateralisationRatio)))}%`
    )
    setTargetRatio(
      _issuanceRatio.isZero()
        ? '-'
        : `${numberWithCommas(new BigNumber('100').dividedBy(weiToBigNumber(_issuanceRatio)))}%`)
  }, [account, refreshFlag])

  useEffect(() => {
    fetchRatio()
      .catch(e => {
        console.error('error in useRatioData:', e)
      })
  }, [fetchRatio, networkReady])

  return {
    myRatio,
    targetRatio
  }
}

const useShadowsData = (refreshFlag: number): { totalDows: BigNumber, availableDows: BigNumber, lockedDows: BigNumber } => {
  const account = useSelector(getAccount)

  const { networkReady } = useWeb3EnvContext()

  const [totalDows, setTotalDows] = useState(new BigNumber(0))
  const [availableDows, setAvailableDows] = useState(new BigNumber(0))
  const [lockedDows, setLockedDows] = useState(new BigNumber(0))

  const fetch = useCallback(async () => {
    if (!networkReady || !addressAvailable(account)) {
      return
    }

    const [_dowsBalance, _transferableDows] = await Promise.all([
      dowsJSConnector.dowsJs.Shadows.balanceOf(account),
      dowsJSConnector.dowsJs.Synthesizer.transferableShadows(account)
    ])

    setTotalDows(weiToBigNumber(_dowsBalance))
    setAvailableDows(weiToBigNumber(_transferableDows))
    setLockedDows(weiToBigNumber(_dowsBalance.sub(_transferableDows)))
  }, [account, refreshFlag, networkReady])

  useEffect(() => {
    fetch()
      .catch(e => {
        console.error('error in useShadowsData:', e)
      })
  }, [fetch])

  return {
    totalDows,
    availableDows,
    lockedDows
  }
}

const useFeePoolData = (refreshFlag: number): FeePoolData => {
  const account = useSelector(getAccount)

  const { networkReady } = useWeb3EnvContext()

  const [totalFees, setTotalFees] = useState(new BigNumber(0))
  const [redeemableFees, setRedeemableFees] = useState(new BigNumber(0))
  const [totalRewards, setTotalRewards] = useState(new BigNumber(0))
  const [escrowedRewards, setEscrowedRewards] = useState(new BigNumber(0))
  const [redeemableRewards, setRedeemableRewards] = useState(new BigNumber(0))
  const [nextVestTime, setNextVestTime] = useState('')
  const [vestingScheduleTime, setVestingScheduleTime] = useState('')

  const fetch = useCallback(async () => {
    if (!networkReady || !addressAvailable(account)) {
      const ZERO = new BigNumber(0)
      setTotalRewards(ZERO)
      setEscrowedRewards(ZERO)
      setRedeemableRewards(ZERO)
      return
    }

    const [_feesByPeriod, [_totalFees], _balanceOf, _vestTime, _vestQuantiry, _vestingScheduleTime] = await Promise.all([
      dowsJSConnector.dowsJs.FeePool.feesByPeriod(account),
      dowsJSConnector.dowsJs.FeePool.feesAvailable(account),
      dowsJSConnector.dowsJs.RewardEscrow.balanceOf(account),
      dowsJSConnector.dowsJs.RewardEscrow.getNextVestingTime(account),
      dowsJSConnector.dowsJs.RewardEscrow.getNextVestingQuantity(account),
      dowsJSConnector.dowsJs.RewardEscrow.vestingScheduleTime(),
    ])

    setTotalFees(
      _feesByPeriod
        .map(arr => arr.map(item => weiToBigNumber(item)))
        .reduce((prev: BigNumber, curr: BigNumber[]) => prev.plus(curr[0]), new BigNumber(0))
    )
    setRedeemableFees(weiToBigNumber(_totalFees))

    setTotalRewards(
      _feesByPeriod
        .map(arr => arr.map(item => weiToBigNumber(item)))
        .reduce((prev: BigNumber, curr: BigNumber[]) => prev.plus(curr[1]), new BigNumber(0))
    )
    setEscrowedRewards(weiToBigNumber(_balanceOf))

    if (Number(utc().format('X')) >= Number(_vestTime.toString())) {
      setRedeemableRewards(weiToBigNumber(_vestQuantiry))
    } else {
      setRedeemableRewards(weiToBigNumber(0))
    }

    setNextVestTime(utc(_vestTime).format('MMM DD,YYYY hh:mm:ss A') + '(UTC)')
    setVestingScheduleTime(_vestingScheduleTime)

  }, [account, refreshFlag, networkReady])

  useEffect(() => {
    fetch()
      .catch(e => {
        console.error('error in useFeePoolData:', e)
      })
  }, [fetch])


  return {
    totalFees,
    redeemableFees,
    totalRewards: totalRewards.plus(escrowedRewards),
    escrowedRewards,
    redeemableRewards,
    nextVestTime,
    vestingScheduleTime
  }
}

export const useDowsSynthesizerData = (): TradeData => {
  const { fastRefreshFlag } = useRefreshController()

  const { myRatio, targetRatio } = useRatioData(fastRefreshFlag)

  const { totalDows, availableDows, lockedDows } = useShadowsData(fastRefreshFlag)

  const {
    totalFees, redeemableFees, totalRewards, escrowedRewards, redeemableRewards, nextVestTime, vestingScheduleTime
  } = useFeePoolData(fastRefreshFlag)

  return {
    myRatio,
    targetRatio,
    totalDows,
    availableDows,
    lockedDows,
    totalFees,
    redeemableFees,
    totalRewards,
    escrowedRewards,
    redeemableRewards,
    nextVestTime,
    vestingScheduleTime
  }
}
