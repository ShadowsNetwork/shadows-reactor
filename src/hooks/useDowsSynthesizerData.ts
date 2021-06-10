import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { numberWithCommas } from '@/utils'
import BigNumber from 'bignumber.js'
import { addressAvailable, weiToBigNumber } from '@/web3/utils'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'

type TradeData = {
  myRatio: string,
  targetRatio: string,

  totalDows: BigNumber,
  availableDows: BigNumber,
  lockedDows: BigNumber,

  totalReward: BigNumber,
  escrowedReward: BigNumber,
  redeemableReward: BigNumber,
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

const useFeePoolData = (refreshFlag: number): { totalReward: BigNumber, escrowedReward: BigNumber, redeemableReward: BigNumber } => {
  const account = useSelector(getAccount)

  const { networkReady } = useWeb3EnvContext()

  const [totalReward, setTotalReward] = useState(new BigNumber(0))
  const [escrowedReward, setEscrowedReward] = useState(new BigNumber(0))
  const [redeemableReward, setRedeemableReward] = useState(new BigNumber(0))

  const fetchClaimFees = useCallback(async () => {
    if (!networkReady || !addressAvailable(account)) {
      const ZERO = new BigNumber(0)
      setTotalReward(ZERO)
      setEscrowedReward(ZERO)
      setRedeemableReward(ZERO)
      return
    }

    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    const [[_, _totalReward], _balanceOf, _vestBalanceOf] = await Promise.all([
      dowsJSConnector.dowsJs.FeePool.feesAvailable(account),
      dowsJSConnector.dowsJs.RewardEscrow.balanceOf(account),
      dowsJSConnector.dowsJs.RewardEscrow.vestBalanceOf(account)
    ])

    setTotalReward(weiToBigNumber(_totalReward))
    setEscrowedReward(weiToBigNumber(_balanceOf))
    setRedeemableReward(weiToBigNumber(_vestBalanceOf))
  }, [account, refreshFlag, networkReady])

  useEffect(() => {
    fetchClaimFees()
      .catch(e => {
        console.error('error in useFeePoolData:', e)
      })
  }, [fetchClaimFees])

  return {
    totalReward,
    escrowedReward,
    redeemableReward
  }
}

export const useDowsSynthesizerData = (): TradeData => {
  const { fastRefreshFlag } = useRefreshController()

  const { myRatio, targetRatio } = useRatioData(fastRefreshFlag)

  const { totalDows, availableDows, lockedDows } = useShadowsData(fastRefreshFlag)

  const { totalReward, escrowedReward, redeemableReward } = useFeePoolData(fastRefreshFlag)

  return {
    myRatio,
    targetRatio,
    totalDows,
    availableDows,
    lockedDows,
    totalReward,
    escrowedReward,
    redeemableReward,
  }
}
