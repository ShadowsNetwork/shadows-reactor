import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { numberWithCommas } from '@/utils'
import BigNumber from 'bignumber.js'
import { weiToBigNumber, weiToString } from '@/web3/utils'

type TradeData = {
  myRatio: string,
  targetRatio: string,

  totalDows: string,
  availableDows: string,
  lockedDows: string,

  totalReward: BigNumber,
  escrowedReward: BigNumber,
  redeemableReward: BigNumber,

  refresh: () => void
}

const useRatioData = (refreshFlag: number): { myRatio: string, targetRatio: string } => {
  const account = useSelector(getAccount)

  const [myRatio, setMyRatio] = useState('-')
  const [targetRatio, setTargetRatio] = useState('-')

  const fetchRatio = useCallback(async () => {
    if (!account) {
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
  }, [fetchRatio])

  return {
    myRatio,
    targetRatio
  }
}

const useShadowsData = (refreshFlag: number): { totalDows: string, availableDows: string, lockedDows: string } => {
  const account = useSelector(getAccount)

  const [totalDows, setTotalDows] = useState('-')
  const [availableDows, setAvailableDows] = useState('-')
  const [lockedDows, setLockedDows] = useState('-')

  const fetch = useCallback(async () => {
    if (!account) {
      return
    }
    // console.log(await dowsJSConnector.dowsJs.Synthesizer.contract!.hasIssued(account))

    const [_dowsBalance, _transferableDows] = await Promise.all([
      dowsJSConnector.dowsJs.Shadows.balanceOf(account),
      dowsJSConnector.dowsJs.Synthesizer.transferableShadows(account)
    ])

    setTotalDows(weiToString(_dowsBalance, 6))
    setAvailableDows(weiToString(_transferableDows, 6))
    setLockedDows(weiToString(_dowsBalance.sub(_transferableDows), 6))
  }, [account, refreshFlag])

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

  const [totalReward, setTotalReward] = useState(new BigNumber(0))
  const [escrowedReward, setEscrowedReward] = useState(new BigNumber(0))
  const [redeemableReward, setRedeemableReward] = useState(new BigNumber(0))

  const fetchClaimFees = useCallback(async () => {
    const [_escrowed, _redeemable] = await dowsJSConnector.dowsJs.FeePool.feesAvailable(account)

    setTotalReward(weiToBigNumber(_escrowed.add(_redeemable)))
    setEscrowedReward(weiToBigNumber(_escrowed))
    setRedeemableReward(weiToBigNumber(_redeemable))
  }, [account, refreshFlag])

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
  const [refreshFlag, setRefreshFlag] = useState(0)

  const { myRatio, targetRatio } = useRatioData(refreshFlag)

  const { totalDows, availableDows, lockedDows } = useShadowsData(refreshFlag)

  const { totalReward, escrowedReward, redeemableReward } = useFeePoolData(refreshFlag)

  const refresh = () => {
    setRefreshFlag(refreshFlag + 1)
  }

  return {
    myRatio,
    targetRatio,
    totalDows,
    availableDows,
    lockedDows,
    totalReward,
    escrowedReward,
    redeemableReward,
    refresh
  }
}
