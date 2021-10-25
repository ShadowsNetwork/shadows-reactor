import React, { useState } from 'react'
import { Button } from 'antd'
import { numberWithCommas } from '@/utils'
import DowsSynthesizer from '@/components/DowsSynthesizer'
import { useCurrencyData } from '@/hooks/useTradeData'
import { useHomeData } from '@/hooks/useHomeData'
import { useHistory } from 'react-router-dom'
import { toBigNumber } from '@/web3/utils'
import { shadowsSynthsConfig, ShadowsSynth } from '@/config/img.config'
import {
  DivContainer,
  ContentContainer,
  DowsSynthesizerContainer,
  PairsInfoContainer,
  StatInfoContainer
} from './index.css'

const PairInfo: React.FC = () => {
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

  const history = useHistory()

  let { keyPairs } = useCurrencyData()
  if (selectedType !== 'All') {
    keyPairs = keyPairs?.filter(keyPair =>
      shadowsSynthsConfig.find(val => val.symbol === keyPair?.symbol[0])?.type === selectedType
    )
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
                onClick={() => history.push({
                  pathname: '/trade',
                  state: {
                    keyPair
                  }
                })}
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

const StatInfo: React.FC = () => {
  const { yourBalance, dowsBalance, debtPool, assetsBalanceList, netTradingBalance } = useHomeData()

  const newNetTradingBalance = netTradingBalance >= toBigNumber(0) ? `$${numberWithCommas(netTradingBalance)}` : numberWithCommas(netTradingBalance).replace('-', '-$')

  const currencyIcon = (key: string) => {
    const map = shadowsSynthsConfig.find((item: ShadowsSynth) => item.symbol === key)
    return require(`../../img/tokens/${map?.symbol || 'xUSD'}.svg`)
  }

  return (
    <StatInfoContainer>
      <div className="summary-row">
        <div className="summary-item">
          <div className="label">Your Balance</div>
          <div className="value">${numberWithCommas(yourBalance)}</div>
        </div>
        <div className="summary-item">
          <div className="label">DOWS Balance</div>
          <div className="value">${numberWithCommas(dowsBalance)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Net Trading Balance</div>
          <div className="value">{newNetTradingBalance}</div>
        </div>
      </div>
      <div className="asset-list">
        <div className="column">
          <div className="header">Asset</div>
          {
            assetsBalanceList.map(asset => (
              <div className="item" key={asset.key}>
                <span>
                  {
                    <img
                      className="icon"
                      src={currencyIcon(asset.key)}
                      alt={asset.key}
                    />
                  }
                </span>
                {asset.key}
              </div>
            ))
          }
          <div className="item" style={{ marginLeft: '3.5rem' }}>My Debt</div>
        </div>
        <div className="column">
          <div className="header">Qty</div>
          {
            assetsBalanceList.map(asset => (
              <div className="item" key={asset.key}>
                {/*{asset.quantity.toString()}*/}
                {numberWithCommas(asset.quantity, 6)}
              </div>
            ))
          }
          <div className="item">-</div>
        </div>
        <div className="column">
          <div className="header">Value</div>
          {
            assetsBalanceList.map(asset => (
              <div className="item" key={asset.key}>
                ${numberWithCommas(asset.value)}
              </div>
            ))
          }
          <div className="item">(${numberWithCommas(debtPool)})</div>
        </div>
      </div>
    </StatInfoContainer>
  )
}

const HomePage: React.FC = () => {
  return (
    <DivContainer>
      <ContentContainer>
        <DivContainer>
          <StatInfo />
        </DivContainer>
        <DivContainer>
          <DowsSynthesizerContainer>
            <DowsSynthesizer />
          </DowsSynthesizerContainer>
        </DivContainer>
        <DivContainer>
          <PairInfo />
        </DivContainer>
      </ContentContainer>
    </DivContainer>
  )
}

export default HomePage
