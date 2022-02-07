import React, { useMemo, useState } from 'react'
import { Button } from 'antd'
import { KeyPair, useCurrencyData } from '@/hooks/data/useTradeData'
import { shadowsSynthsConfig } from '@/config/img.config'
import styled from 'styled-components'
import { Box } from '@/pages/Home/index.css'

const PairsInfoContainer = styled(Box)`
  width: 29.7rem;
  padding: 1.8rem 1.2rem;

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.2rem;
  }

  .list {
    font-weight: bold;

    .item, .header {
      display: flex;
      justify-content: space-between;
    }

    .item {
      color: white;
      font-size: 1.4rem;
      user-select: none;
      cursor: pointer;
      transition: all 0.2s linear;

      &:hover {
        transform: scale(101.5%);
        color: #63cca9;
      }
    }


    .header {
      padding: 0 1.2rem;
      color: #979797 !important;
      font-size: 1.2rem;
      user-select: none;
    }

    .content {
      padding: 0 1.2rem;
      height: 23em;
      overflow: auto
    }
  }

  @media screen and (max-width: 1080px) {
    width: 100%;
    margin: 0;
  }
`

const StatefulButton: React.FC<{ name: string, active: boolean, onclick: (_value: string) => void }> = ({
  name, onclick, active
}) => {
  const handleClick = () => {
    onclick(name)
  }

  return (
    <div>
      <Button
        type="text"
        onClick={handleClick}
        style={{
          color: active ? '#63cca9' : '#979797',
          fontWeight: 'bold',
          padding: '0'
        }}
      >
        {name}
      </Button>
    </div>
  )
}

const PairPanel: React.FC<{ onItemClicked: (_item: KeyPair) => void }> = ({ onItemClicked }) => {
  const [selectedType, setSelectedType] = useState('All')

  const { data: currencyData } = useCurrencyData()

  const keyPairs = useMemo(() => {
    if (!currencyData) {
      return []
    }

    const { keyPairs } = currencyData

    if (selectedType !== 'All') {
      return keyPairs?.filter(keyPair =>
        shadowsSynthsConfig.find(val => val.symbol === keyPair?.symbol[0])?.type === selectedType
      )
    } else {
      return keyPairs
    }

  }, [selectedType, currencyData])

  const types = [
    'All', 'Cryptos', 'Fiat', 'Commodities'
  ]

  return (
    <PairsInfoContainer>
      <div className="button-group">
        {
          types.map(type => (
            <StatefulButton
              key={type}
              name={type}
              onclick={setSelectedType}
              active={selectedType === type}
            />
          ))
        }
      </div>
      <div className="list">
        <div className="header">
          <div className="key">Symbol</div>
          <div className="value">Last Price</div>
        </div>
        <div className="content">
          {
            keyPairs?.map((keyPair, index) => {
              const { symbol, lastPrice } = keyPair
              return (
                <div
                  className="item"
                  key={index}
                  onClick={() => onItemClicked(keyPair)}
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
      </div>
    </PairsInfoContainer>
  )

}

export default PairPanel
