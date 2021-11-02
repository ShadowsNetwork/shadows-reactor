import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import { utc } from 'moment'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { numberWithCommas } from '@/utils'
import BigNumber from 'bignumber.js'
import { addressAvailable, weiToBigNumber } from '@/web3/utils'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'
import { useQuery } from 'react-query'
import { UseQueryResult } from 'react-query/types/react/types'

type FeePoolData = {
  totalFees?: BigNumber
  redeemableFees?: BigNumber
  totalRewards?: BigNumber
  escrowedRewards?: BigNumber
  redeemableRewards?: BigNumber,
  nextVestTime?: string,
  vestingScheduleTime?: BigNumber
}

type RatioData = {
  myRatio?: string,
  targetRatio?: string,
}

type ShadowsData = {
  totalDows?: BigNumber,
  availableDows?: BigNumber,
  lockedDows?: BigNumber,
}

type TradeData = FeePoolData & RatioData & ShadowsData

const useRatioData = (): UseQueryResult<RatioData> => {
  const { slowRefreshFlag } = useRefreshController()
  const account = useSelector(getAccount)
  const { networkReady, providerReady } = useWeb3EnvContext()

  return useQuery<RatioData>(['RATIO_DATA', account, slowRefreshFlag, networkReady, providerReady], async () => {
    if (!providerReady) {
      return {}
    }

    if (!networkReady || !addressAvailable(account)) {
      const _issuanceRatio = await dowsJSConnector.dowsJs.Synthesizer.issuanceRatio()

      return {
        targetRatio: (
          _issuanceRatio.isZero()
            ? '-'
            : `${numberWithCommas(new BigNumber('100').dividedBy(weiToBigNumber(_issuanceRatio)))}%`)
      }
    }

    const [_collateralisationRatio, _issuanceRatio] = await Promise.all([
      dowsJSConnector.dowsJs.Synthesizer.collateralisationRatio(account),
      dowsJSConnector.dowsJs.Synthesizer.issuanceRatio()
    ])

    return {
      myRatio: (
        _collateralisationRatio.isZero()
          ? '-'
          : `${numberWithCommas(new BigNumber('100').dividedBy(weiToBigNumber(_collateralisationRatio)))}%`
      ),
      targetRatio: (
        _issuanceRatio.isZero()
          ? '-'
          : `${numberWithCommas(new BigNumber('100').dividedBy(weiToBigNumber(_issuanceRatio)))}%`)
    }
  })
}

const useShadowsData = (): UseQueryResult<ShadowsData> => {
  const { slowRefreshFlag } = useRefreshController()
  const account = useSelector(getAccount)
  const { networkReady, providerReady } = useWeb3EnvContext()

  return useQuery<ShadowsData>(['SHADOWS_DATA', account, slowRefreshFlag, networkReady, providerReady], async () => {
    if (!providerReady || !addressAvailable(account)) {
      return {}
    }

    const [_dowsBalance, _transferableDows] = await Promise.all([
      dowsJSConnector.dowsJs.Shadows.balanceOf(account),
      dowsJSConnector.dowsJs.Synthesizer.transferableShadows(account)
    ])

    return {
      totalDows: weiToBigNumber(_dowsBalance),
      availableDows: weiToBigNumber(_transferableDows),
      lockedDows: weiToBigNumber(_dowsBalance.sub(_transferableDows))
    }
  })
}

const useFeePoolData = (): UseQueryResult<FeePoolData> => {
  const { slowRefreshFlag } = useRefreshController()
  const account = useSelector(getAccount)
  const { networkReady, providerReady } = useWeb3EnvContext()

  return useQuery<FeePoolData>(['FEE_POOL_DATA', account, slowRefreshFlag, networkReady], async () => {
    if (!providerReady) {
      return {}
    }

    if (!networkReady || !addressAvailable(account)) {
      return {
        vestingScheduleTime: await dowsJSConnector.dowsJs.RewardEscrow.vestingScheduleTime()
      }
    }

    const [_feesByPeriod, [_totalFees], _balanceOf, _vestTime, _vestQuantity, _vestingScheduleTime] = await Promise.all([
      dowsJSConnector.dowsJs.FeePool.feesByPeriod(account),
      dowsJSConnector.dowsJs.FeePool.feesAvailable(account),
      dowsJSConnector.dowsJs.RewardEscrow.balanceOf(account),
      dowsJSConnector.dowsJs.RewardEscrow.getNextVestingTime(account),
      dowsJSConnector.dowsJs.RewardEscrow.getNextVestingQuantity(account),
      dowsJSConnector.dowsJs.RewardEscrow.vestingScheduleTime()
    ])

    return {
      totalFees: _feesByPeriod
        .map(arr => arr.map(item => weiToBigNumber(item)))
        .reduce((prev: BigNumber, curr: BigNumber[]) => prev.plus(curr[0]), new BigNumber(0)),
      redeemableFees: weiToBigNumber(_totalFees),
      totalRewards: _feesByPeriod
        .map(arr => arr.map(item => weiToBigNumber(item)))
        .reduce((prev: BigNumber, curr: BigNumber[]) => prev.plus(curr[1]), new BigNumber(0)),
      escrowedRewards: weiToBigNumber(_balanceOf),
      redeemableRewards: weiToBigNumber(Number(utc()
        .format('X')) >= Number(_vestTime.toString()) ? _vestQuantity : 0),
      nextVestTime: utc(_vestTime)
        .format('MMM DD,YYYY hh:mm:ss A') + '(UTC)',
      vestingScheduleTime: _vestingScheduleTime
    }
  })
}

export const useDowsSynthesizerData = (): TradeData => {
  return {
    ...useRatioData().data,
    ...useShadowsData().data,
    ...useFeePoolData().data
  }
}
