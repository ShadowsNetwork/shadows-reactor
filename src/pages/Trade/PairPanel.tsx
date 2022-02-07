import { KeyPair, useCurrencyData } from '@/hooks/data/useTradeData'
import React, { useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import { shadowsSynthsConfig } from '@/config/img.config'
import styled from 'styled-components'

type PairInfoProps = {
  onSelectedKeyPairChanged: (_selectedKeyPair: KeyPair) => void
  selectedKeyPair?: KeyPair
}

export const PairsInfoContainer = styled.div`
  padding: 1.8rem 1.2rem;
  height: 100%;

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.2rem;
    padding: 0 1.2rem;
  }

  .list {
    font-weight: bold;
    overflow-y: auto;
    height: calc(41rem - 80px);

    .item, .header {
      display: flex;
      justify-content: space-between;
    }

    .item {
      color: white;
      font-size: 1.4rem;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s linear;

      &:hover {
        transform: scale(101.5%);
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
      height: fit-content;
      overflow: auto;
    }
  }
`

const PairPanel: React.FC<PairInfoProps> = ({ onSelectedKeyPairChanged, selectedKeyPair }) => {
  const [selectedType, setSelectedType] = useState('All')

  const TypeSelectButton = ({ name }: { name: string }) => {
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
        <TypeSelectButton name="All" />
        <TypeSelectButton name="Cryptos" />
        <TypeSelectButton name="Fiat" />
        <TypeSelectButton name="Commodities" />
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
      </div>
    </PairsInfoContainer>
  )
}

export default PairPanel
