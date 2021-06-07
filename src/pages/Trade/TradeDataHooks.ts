import { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import { bytesToString, weiToBigNumber, weiToString } from '@/web3/utils'
import BigNumber from 'bignumber.js'
import { numberWithCommas } from '@/utils'

export type TradeData = {
  myRatio: string,
  targetRatio: string,

  totalDows: string,
  availableDows: string,
  lockedDows: string,

  totalReward: string,
  escrowedReward: string,
  redeemableReward: string,

  refresh: () => void
}

export type KeyPair = {
  symbol: SymbolPair,
  lastPrice: string
}

type PairData = {
  keyPairs?: KeyPair[]
  keyList: string[]
}

type SymbolPair = [string, string]

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
        ? 'None'
        : `${numberWithCommas(new BigNumber('100').dividedBy(weiToBigNumber(_collateralisationRatio)))}%`
    )
    setTargetRatio(
      _issuanceRatio.isZero()
        ? 'None'
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

const useFeePoolData = (refreshFlag: number): { totalReward: string, escrowedReward: string, redeemableReward: string } => {
  const account = useSelector(getAccount)

  const [totalReward, setTotalReward] = useState('-')
  const [escrowedReward, setEscrowedReward] = useState('-')
  const [redeemableReward, setRedeemableReward] = useState('-')

  const fetchClaimFees = useCallback(async () => {
    const [_escrowed, _redeemable] = await dowsJSConnector.dowsJs.FeePool.feesAvailable(account)

    setTotalReward(numberWithCommas(weiToString(_escrowed.add(_redeemable))))
    setEscrowedReward(numberWithCommas(weiToString(_escrowed)))
    setRedeemableReward(numberWithCommas(weiToString(_redeemable)))
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

export const useChartData = () => {
  return {}
}

export const useSynthAssetsData = (): TradeData => {
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

export const usePairData = (): PairData => {
  const [keyPairs, setKeyPairs] = useState<KeyPair[] | undefined>(undefined)
  const [keyList, setKeyList] = useState<string[]>([])

  const fetch = useCallback(async () => {
    // ['xUSD', 'xAUD', 'xEUR', ...]
    const _keyList: Array<string> = (await dowsJSConnector.dowsJs.Synthesizer.availableCurrencyKeys()).map(k => bytesToString(k))

    // ['1.000000', '0.500000', '0.75000000', ...]
    const ratesList = (
      await Promise.all(
        _keyList.map(key => dowsJSConnector.dowsJs.Oracle.rateForCurrency(key))
      )
    ).map(rate => weiToBigNumber(rate))

    /**
     * {
     *   'xUSD' => '1.000000',
     *   'xAUD' => '0.500000',
     *   'xEUR' => '0.750000',
     *   ...
     * }
     */
    const keysByRate = new Map(_keyList.map((key, index) => [key, ratesList[index]]))

    const keysSet = new Set<string>(_keyList)
    keysSet.delete('xUSD')

    /**
     * Get key pair price by source key and target key.
     * @param sourceKey
     * @param targetKey
     */
    const pairPrice = (sourceKey: string, targetKey: string): string =>
      keysByRate.get(sourceKey)!
        .dividedBy(keysByRate.get(targetKey)!)
        .toFixed(6)

    /**
     * [
     *  { symbol: ['xAUD', 'xUSD'], lastPrice: '0.500000' },
     *  { symbol: ['xEUR', 'xUSD'], lastPrice: '1.250000' },
     *  ...
     * ]
     */
    const _keyPairs = Array.from(keysSet)
      .map<KeyPair>(
        key => ({
          symbol: [key, 'xUSD'],
          lastPrice: pairPrice(key, 'xUSD')
        })
      )

    setKeyList(_keyList)
    setKeyPairs(_keyPairs)
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return {
    keyPairs,
    keyList
  }
}

export const useCurrencyBalance = () => {
  const { keyList } = usePairData()
  const account = useSelector(getAccount)
  const [balanceByCurrency, setBalanceByCurrency] = useState<{ [key: string]: string }>({})
  const [refreshFlag, setRefreshFlag] = useState(0)

  const refresh = () => {
    setRefreshFlag(refreshFlag + 1)
  }

  const fetchBalance = useCallback(async () => {
    if (keyList.length > 0 && account) {
      const balanceList = await Promise.all(keyList.map(key => dowsJSConnector.dowsJs.Synth.balanceOf(key, account)))

      const _balanceByCurrency = {}
      keyList.forEach((key, index) => {
        _balanceByCurrency[key] = balanceList[index]
      })

      setBalanceByCurrency(_balanceByCurrency)
    }
  }, [keyList, refreshFlag, account])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return {
    balanceByCurrency,
    refresh
  }
}
