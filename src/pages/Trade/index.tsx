import { Button, Slider } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import LimitableNumberInput from '@/components/LimitableNumberInput'
import { createChart, CrosshairMode, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts'
import { useErrorMessage } from '@/hooks'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { toBigNumber, toByte32, toWei, weiToBigNumber, weiToString } from '@/web3/utils'
import useTradingDataQuery from '@/queries/useTradingDataQuery'
import BigNumber from 'bignumber.js'
import DowsSynthesizer from '@/components/DowsSynthesizer'
import { KeyPair, useCurrencyBalance, useCurrencyData, useCurrencyPrice } from '@/hooks/useTradeData'
import { TradeSynth } from '@/types/TransactionHistory'
import { numberWithCommas } from '@/utils'
import { appendTransactionHistory } from '@/store/wallet'
import { useTransactionStatusModal } from '@/contexts/TransactionStatusModalContext'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { shadowsSynthsConfig, ShadowsSynth } from '@/config/img.config'
import {
  TradePageContainer,
  Column,
  CandlestickContainer,
  StatsContainer,
  ContainerForDowsAndPair,
  ContainerForBuyAndSell,
  PairsInfoContainer,
  CustomizedSlider
} from './index.css'

type PairInfoProps = {
  onSelectedKeyPairChanged: (_selectedKeyPair: KeyPair) => void
  selectedKeyPair?: KeyPair
}

type BuySellPanelProps = {
  type: 'Buy' | 'Sell'
  color: string
  keyPair?: KeyPair,
  balanceByCurrency: { [key: string]: BigNumber }
}

const PairInfo: React.FC<PairInfoProps> = ({ onSelectedKeyPairChanged, selectedKeyPair }) => {
  const [selectedType, setSelectedType] = useState('All')
  const StatefulButton = ({ name }: { name: string }) => {
    const handleClick = () => {
      setSelectedType(name)
    }

    const isActive = selectedType === name

    return (
      <div>
        <Button
          type="text"
          onClick={handleClick}
          style={{
            color: isActive ? '#63cca9' : '#979797',
            fontWeight: 'bold',
            padding: '0'
          }}
        >
          {name}
        </Button>
      </div>
    )
  }

  let { keyPairs } = useCurrencyData()
  if (selectedType !== 'All') {
    keyPairs = keyPairs?.filter(keyPair =>
      shadowsSynthsConfig.find(val => val.symbol === keyPair?.symbol[0])?.type === selectedType
    )
  }

  const handleSelectKeyPair = (keypair: KeyPair) => {
    onSelectedKeyPairChanged(keypair)
  }

  useEffect(() => {
    if (keyPairs?.length && !selectedKeyPair) {
      handleSelectKeyPair(keyPairs[0])
    }
  }, [keyPairs, selectedKeyPair])

  const isKeyPairSelected = (keyPair: KeyPair) => {
    const s1 = selectedKeyPair?.symbol
    const s2 = keyPair.symbol
    return s1 && s2 && s1[0] === s2[0] && s1[1] === s2[1]
  }

  return (
    <PairsInfoContainer>
      <div className="button-group">
        <StatefulButton name="All" />
        <StatefulButton name="Cryptos" />
        {/* <StatefulButton name="Fiat" /> */}
        <StatefulButton name="Commodities" />
        <StatefulButton name="Equities" />
      </div>
      <div className="list">
        <div className="header">
          <div className="key">Symbol</div>
          <div className="value">Last Price</div>
        </div>
        {
          keyPairs?.map((keyPair, index) => {
            const { symbol, lastPrice } = keyPair
            return (
              <div
                className="item"
                key={index}
                onClick={() => handleSelectKeyPair(keyPair)}
                style={{ color: isKeyPairSelected(keyPair) ? '#63cca9' : '' }}
              >
                <div className="key">
                  {`${symbol[0]} / ${symbol[1]}`}
                </div>
                <div className="value">{lastPrice}</div>
              </div>
            )
          })
        }
      </div>
    </PairsInfoContainer>
  )

}

const BuySellPanel: React.FC<BuySellPanelProps> = ({
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

  const sliderMarks = {
    0: '',
    25: '',
    50: '',
    75: '',
    100: ''
  }

  const unit = keyPair?.symbol[type === 'Buy' ? 1 : 0]

  const available: BigNumber = (unit && balanceByCurrency[unit]) || new BigNumber('0')

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
    const sourceAmount = toWei(inputValue)

    beginTransaction()

    dowsJSConnector.dowsJs.Synthesizer.exchange(sourceCurrencyKey, sourceAmount, destinationCurrencyKey)
      .then(tx => {
        const transactionHistory: TradeSynth = new TradeSynth(tx.hash, numberWithCommas(inputValue, 6), type, keyPair!.symbol[0])
        dispatch(appendTransactionHistory(transactionHistory))
        submitTransaction()
      })
      .catch(e => {
        rejectTransaction(errorMessageGetter(e))
      })
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
          disabled={available.eq(0)}
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

const Stats: React.FC<{ keyPair?: KeyPair }> = ({ keyPair }) => {
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

const TradingView: React.FC<{ keyPair?: KeyPair, mode: string }> = ({ keyPair, mode }) => {
  const [chart, setChart] = useState<IChartApi | undefined>()
  const [series, setSeries] = useState<ISeriesApi<'Area'> | ISeriesApi<'Histogram'> | undefined>()
  const ref = useRef()

  const { data } = useTradingDataQuery(mode, keyPair?.symbol[0])

  /**
   * create chart first
   */
  useEffect(() => {
    // @ts-ignore
    const _chart = createChart(ref.current)
    _chart.applyOptions({
      width: 500,
      height: 320,
      layout: {
        backgroundColor: '#000000',
        textColor: 'rgba(255, 255, 255, 0.9)'
      },
      grid: {
        vertLines: {
          color: 'rgba(197, 203, 206, 0.5)'
        },
        horzLines: {
          color: 'rgba(197, 203, 206, 0.5)'
        }
      },
      crosshair: {
        mode: CrosshairMode.Normal
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
  }, [])

  /**
   * after chart created, create series by different mode.
   * When mode was switched, if there is a existed series, need to remove it first
   */
  useEffect(() => {
    if (!chart) {
      return
    }
    if (series) {
      chart.removeSeries(series)
    }

    if (mode === 'price') {
      setSeries(chart.addAreaSeries())
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
      series.setData(data.data.map(item => ({
        ...item,
        value: Number.parseFloat(weiToString(item.price)),
        time: (parseInt(item.time)) / 1000
      })))

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

      chart?.timeScale()
        .fitContent()
    }

  }, [data, series])

  // @ts-ignore
  return <div ref={ref} id="chart" />
}

const CurrencyInfo: React.FC<{ keyPair?: KeyPair }> = ({ keyPair }) => {
  // const availableTimeRange = [
  //   { key: '1m', value: 1 },
  //   { key: '5m', value: 5 },
  //   { key: '1h', value: 60 }
  // ]

  const availableMode = [
    { key: 'Price', value: 'price' },
    { key: 'Volume', value: 'volume' }
    // { key: 'Liquidity', value: 3 }
  ]

  // const [selectedTimeRange, setSelectedTimeRange] = useState('1m')
  const [selectedMode, setSelectedMode] = useState({ key: 'Price', value: 'price' })

  const { data } = useTradingDataQuery('price', keyPair?.symbol[0])

  // const currentPrice = (() => {
  //   if (data?.data) {
  //     const len = data.data.length
  //     if (len) {
  //       return numberWithCommas(weiToBigNumber(data.data[len - 1].price))
  //     }
  //   }
  //   return '---'
  // })()

  const { currentPrice } = useCurrencyPrice(keyPair?.symbol[0])

  const currencyIcon = (key: string) => {
    const map = shadowsSynthsConfig.find((item: ShadowsSynth) => item.symbol === key)
    return require(`../../img/tokens/${map?.symbol || 'xUSD'}.svg`)
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
          keyPair ? `${keyPair.symbol[0] || ''} / ${keyPair.symbol[1] || ''}` : '- / xUSD'
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
      {/*<div className="time-select-btn-group">
        {
          availableTimeRange.map(time => (
            <Button
              className="btn"
              key={time.key}
              onClick={() => setSelectedTimeRange(time.key)}
              style={{ backgroundColor: time.key === selectedTimeRange ? '#63cca9' : 'transparent' }}
            >
              {time.key}
            </Button>
          ))
        }
      </div>*/}
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

const TradePage: React.FC = () => {
  const { state } = useLocation()

  const { balanceByCurrency } = useCurrencyBalance()

  const [selectedKeyPair, setSelectedKeyPair] = useState<KeyPair | undefined>((state as any)?.keyPair)

  const handleSelectedKeyPairChanged = (keyPair: KeyPair) => {
    setSelectedKeyPair(keyPair)
  }

  return (
    <TradePageContainer>
      <Column width="53.6rem" marginRight="1.5rem">
        <CurrencyInfo keyPair={selectedKeyPair} />
        <Stats keyPair={selectedKeyPair} />
      </Column>
      <Column width="33.1rem" marginRight="0.8rem">
        <ContainerForDowsAndPair>
          <DowsSynthesizer />
        </ContainerForDowsAndPair>
        <ContainerForBuyAndSell>
          <BuySellPanel
            balanceByCurrency={balanceByCurrency}
            color="#63cca9"
            type="Buy"
            keyPair={selectedKeyPair}
          />
        </ContainerForBuyAndSell>
      </Column>
      <Column width="30.7rem">
        <ContainerForDowsAndPair>
          <PairInfo
            onSelectedKeyPairChanged={handleSelectedKeyPairChanged}
            selectedKeyPair={selectedKeyPair}
          />
        </ContainerForDowsAndPair>
        <ContainerForBuyAndSell>
          <BuySellPanel
            balanceByCurrency={balanceByCurrency}
            color="#DB5E56"
            type="Sell"
            keyPair={selectedKeyPair}
          />
        </ContainerForBuyAndSell>
      </Column>
    </TradePageContainer>
  )
}

export default TradePage
