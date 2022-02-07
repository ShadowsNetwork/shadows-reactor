import { BalanceByCurrency, KeyPair, useCurrencyPrice } from '@/hooks/data/useTradeData'
import React, { useEffect, useRef, useState } from 'react'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import { useDispatch } from 'react-redux'
import { useTransactionStatusModal } from '@/contexts/TransactionStatusModalContext'
import BigNumber from 'bignumber.js'
import { toBigNumber, toByte32, toWei, weiToBigNumber, weiToString } from '@/web3/utils'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { TradeSynth } from '@/types/TransactionHistory'
import { numberWithCommas } from '@/utils'
import { appendTransactionHistory } from '@/store/wallet'
import LimitableNumberInput from '@/components/LimitableNumberInput'
import { CandlestickContainer, CustomizedSlider, StatsContainer } from './components.style'
import { Button, Slider } from 'antd'
import useTradingDataQuery from '@/queries/useTradingDataQuery'
import {
  createChart, CrosshairMode, IChartApi, ISeriesApi, Time, UTCTimestamp
} from 'lightweight-charts'
import { ShadowsSynth, shadowsSynthsConfig } from '@/config/img.config'
import useResponsive from '@/hooks/useResponsive'

export type BuySellPanelProps = {
  type: 'Buy' | 'Sell'
  color: string
  keyPair?: KeyPair,
  balanceByCurrency?: BalanceByCurrency
}

export const sliderMarks = {
  0: '',
  25: '',
  50: '',
  75: '',
  100: ''
}

export const BuySellPanel: React.FC<BuySellPanelProps> = ({
  type,
  color,
  keyPair,
  balanceByCurrency
}) => {
  const errorMessageGetter = useErrorMessage()

  const dispatch = useDispatch()

  const { beginTransaction, submitTransaction, rejectTransaction } = useTransactionStatusModal()

  const [inputValue, setInputValue] = useState('0')
  const [sliderValue, setSliderValue] = useState(0)

  const unit = keyPair?.symbol[type === 'Buy' ? 1 : 0]
  const available: BigNumber = (unit && balanceByCurrency && balanceByCurrency[unit]) || new BigNumber('0')

  const onSliderChange = value => {
    setSliderValue(value)
    setInputValue(
      available
        .multipliedBy('1e18')
        .multipliedBy(toBigNumber(value)
          .dividedBy(100))
        .dp(0)
        .dividedBy('1e18')
        .toFixed(6)
        .toString()
    )
  }

  const handleExchange = async () => {
    const sourceCurrencyKey = toByte32(keyPair!.symbol[type === 'Buy' ? 1 : 0])
    const destinationCurrencyKey = toByte32(keyPair!.symbol[type === 'Buy' ? 0 : 1])
    const sourceAmount = Math.round(sliderValue) >= 100 ? toWei(available.toString()) : toWei(inputValue)

    beginTransaction()

    dowsJSConnector.dowsJs.Synthesizer.exchange(sourceCurrencyKey, sourceAmount, destinationCurrencyKey)
      .then(tx => {
        const transactionHistory: TradeSynth = new TradeSynth(
          tx.hash,
          numberWithCommas(inputValue, 6),
          type,
          type === 'Sell' ? keyPair!.symbol[0] : 'ShaUSD',
          type === 'Sell' ? 'ShaUSD' : keyPair!.symbol[0]
        )
        dispatch(appendTransactionHistory(transactionHistory))
        submitTransaction()
      })
      .catch(e => {
        rejectTransaction(errorMessageGetter(e))
      })

    // @ts-ignore
    gtag('event', type.toLocaleLowerCase())
  }

  useEffect(() => {
    setSliderValue(
      toBigNumber(inputValue)
        .dividedBy(available)
        .multipliedBy(100)
        .toNumber()
    )
  }, [inputValue])

  return (
    <div className="panel">
      <div className="row">
        <LimitableNumberInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          className="input"
          maximum={available.toFixed(6)}
        />
        <span className="unit" style={{ color }}>{unit}</span>
      </div>
      <CustomizedSlider color={color}>
        <Slider
          disabled={available.toFixed(6).toString() === '0.000000'}
          marks={sliderMarks}
          value={sliderValue}
          onChange={onSliderChange}
          trackStyle={{ backgroundColor: color }}
          handleStyle={{ borderColor: color, color: '#cecece' }}
        />
      </CustomizedSlider>
      <div className="row info-row">
        <span>Balance</span>
        <span>{unit}</span>
      </div>
      <div className="row info-row">
        <span>Available</span>
        <span>{available.toFixed(6)}</span>
      </div>
      <Button
        className="btn"
        onClick={handleExchange}
        style={{ backgroundColor: color }}
        disabled={new BigNumber(inputValue).lte(0)}
      >
        {type}
      </Button>
    </div>
  )
}

export const Stats: React.FC<{ keyPair?: KeyPair }> = ({ keyPair }) => {
  const { data } = useTradingDataQuery('countmaxmin', keyPair?.symbol[0])

  return (
    <StatsContainer>
      <div className="item">
        <div className="title">24h Change</div>
        <div className="value">{numberWithCommas(weiToBigNumber(data?.data.count))}</div>
      </div>
      <div className="item">
        <div className="title">24h High</div>
        <div className="value">{numberWithCommas(weiToBigNumber(data?.data.max))}</div>
      </div>
      <div className="item">
        <div className="title">24h Low</div>
        <div className="value">{numberWithCommas(weiToBigNumber(data?.data.min))}</div>
      </div>
    </StatsContainer>
  )
}

export const TradingView: React.FC<{ keyPair?: KeyPair, mode: string }> = ({ keyPair, mode }) => {
  const [chart, setChart] = useState<IChartApi | undefined>()
  const [series, setSeries] = useState<ISeriesApi<'Area'> | ISeriesApi<'Histogram'> | undefined>()
  const ref = useRef()

  const { isDesktop } = useResponsive()

  const { data } = useTradingDataQuery(mode, keyPair?.symbol[0])

  /**
   * create chart first
   */
  useEffect(() => {
    // @ts-ignore
    const _chart = createChart(ref.current, {
      width: isDesktop ? 760 : document.body.clientWidth * 0.85,
      height: isDesktop ? 360: 240,
      layout: {
        backgroundColor: '#000000',
        textColor: 'rgba(255, 255, 255, 0.9)'
      },
      grid: {
        vertLines: {
          color: 'rgba(197, 203, 206, 0.5)',
          visible: false
        },
        horzLines: {
          color: 'rgba(197, 203, 206, 0.5)',
          visible: false
        }
      },
      overlayPriceScales: {
        entireTextOnly: true
      },
      crosshair: {
        mode: CrosshairMode.Magnet
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)'
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)'
      },
      localization: {
        timeFormatter: (time: UTCTimestamp) => {
          return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          }).format(new Date(time * 1000))
        }
      }
    })

    setChart(_chart)
  }, [ref])

  /**
   * after chart created, create series by different mode.
   * When mode was switched, if there is an existed series, need to remove it first
   */
  useEffect(() => {
    if (!chart) {
      return
    }

    if (series) {
      chart.removeSeries(series)
    }

    if (mode === 'price') {
      setSeries(chart.addAreaSeries({}))
    } else if (mode === 'volume') {
      setSeries(chart.addHistogramSeries({
        base: 0
      }))
    }
  }, [mode, chart])

  useEffect(() => {
    if (!series) {
      return
    }

    if (!data?.data) {
      series.setData([])
      return
    }

    if (mode === 'price') {
      const _data: any[] = []
      const _cahce = {}
      data.data.forEach(item => {
        if (!_cahce[item.time]) {
          _data.push({
            ...item,
            value: Number.parseFloat(weiToString(item.price)),
            time: (parseInt(item.time)) / 1000
          })
          _cahce[item.time] = true
        }
      })
      series.setData(_data)

      chart!.applyOptions({
        handleScroll: true,
        handleScale: true,
        timeScale: {
          tickMarkFormatter: (time: UTCTimestamp) => {
            return new Intl.DateTimeFormat('en-US', {
              hour: '2-digit', minute: '2-digit'
            }).format(new Date(time * 1000))
          }
        }
      })
    } else if (mode === 'volume') {
      series.setData(data.data.map(item => ({
        time: parseInt(item.time) / 1000,
        value: parseFloat(weiToString(item.value))
      })))

      chart!.applyOptions({
        handleScroll: false,
        handleScale: false,
        timeScale: {
          tickMarkFormatter: (time: UTCTimestamp) => {
            return new Intl.DateTimeFormat('en-US', {
              month: 'short', day: 'numeric'
            }).format(new Date(time * 1000))
          }
        }
      })
    }

    if (data.data.length > 0) {
      chart?.timeScale().setVisibleRange({
        from: (parseInt(data.data[0].time) / 1000) as Time,
        to: (parseInt(data.data[data.data.length - 1].time) / 1000) as Time,
      })
    }

  }, [data, series])

  // @ts-ignore
  return <div ref={ref} id="chart" />
}

export const CurrencyInfo: React.FC<{ keyPair?: KeyPair }> = ({ keyPair }) => {
  const availableMode = [
    { key: 'Price', value: 'price' },
    { key: 'Volume', value: 'volume' }
    // { key: 'Liquidity', value: 3 }
  ]

  const [selectedMode, setSelectedMode] = useState({ key: 'Price', value: 'price' })

  const { data } = useTradingDataQuery('price', keyPair?.symbol[0])

  const { currentPrice } = useCurrencyPrice(keyPair?.symbol[0])

  const currencyIcon = (key: string) => {
    const map = shadowsSynthsConfig.find((item: ShadowsSynth) => item.symbol === key)
    return require(`../../img/coin/${map?.symbol || 'ShaUSD'}.png`)
  }

  return (
    <CandlestickContainer>
      <div className="title">
        {
          keyPair?.symbol[0] && (
            <span>
              <img
                src={currencyIcon(keyPair.symbol[0])}
                alt=""
              />
            </span>
          )
        }
        {
          keyPair ? `${keyPair.symbol[0] || ''} / ${keyPair.symbol[1] || ''}` : '- / ShaUSD'
        }
      </div>
      <div className="price-info">
        <div className="current">
          $
          {numberWithCommas(currentPrice || 0)}
        </div>
        <div className="change" style={{ color: data?.usd_24h_change > 0 ? '#63cca9' : '#DB5E56' }}>
          {data?.usd_24h_change > 0 ? `+${data.usd_24h_change.toFixed(2)}%` : `${data?.usd_24h_change?.toFixed(2) || 0}%`}
        </div>
      </div>
      <div className="trading-view-container">
        <TradingView keyPair={keyPair} mode={selectedMode.value} />
      </div>
      <div className="bottom-btn-group">
        {
          availableMode.map(mode => (
            <Button
              className="btn"
              key={mode.key}
              onClick={() => setSelectedMode(mode)}
              style={{ backgroundColor: mode.key === selectedMode.key ? '#63cca9' : 'transparent' }}
            >
              {mode.key}
            </Button>
          ))
        }
      </div>
    </CandlestickContainer>
  )
}
