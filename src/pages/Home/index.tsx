import { Button } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { usePairData } from '@/pages/Trade/TradeDataHooks'
import { useInitializeProvider, useSetupNetwork } from '@/hooks'
import { useHomeData } from '@/pages/Home/HomeDataHooks'
import { numberWithCommas } from '@/utils'
import DowsSynthesizer from '@/components/DowsSynthesizer'

const Box = styled.div`
  background-color: #121725;
  padding: ${props => props.padding};
  height: 36.8rem;
  margin-right: 2.5rem;
  border-radius: 1rem;
`

const HomePageContainer = styled.div`
  display: flex;
`

const DowsSynthesizerContainer = styled(Box)`
  width: 29.7rem;
`

const PairsInfoContainer = styled(Box)`
  width: 29.7rem;
  padding: 1.8rem 1.2rem;

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.2rem;
  }

  .list {
    margin: 0 1.2rem;
    font-weight: bold;

    .item, .header {
      display: flex;
      justify-content: space-between;
    }

    .item {
      color: white;
      font-size: 1.4rem;
      user-select: none;
    }

    .header {
      color: #979797 !important;
      font-size: 1.2rem;
      user-select: none;
    }
  }
`

const StatInfoContainer = styled(Box)`
  width: 54.5rem;
  padding: 4.082rem 2.8rem;

  .summary-row {
    color: white;
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    margin-bottom: 4rem;

    .label {
      font-size: 1.4rem;
    }

    .value {
      font-size: 2.4rem;
    }
  }

  .asset-list {
    font-weight: 500;
    display: flex;
    justify-content: space-between;

    .column {
      .header {
        color: #979797;
        font-size: 1.4rem;
        margin-bottom: 0.5rem;
      }

      .item {
        display: flex;
        align-items: center;
        color: #fffefe;
        height: 3.5rem;
        margin: 0 0 0.2rem 0;
        padding: 0;

        .icon {
          width: 3rem;
          height: 3rem;
          margin-right: 0.5rem;
        }
      }
    }


  }
`

const PairInfo: React.FC = () => {
  const [selectedType, setSelectedType] = useState('All')

  const { keyPairs } = usePairData()

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

  return (
    <PairsInfoContainer>
      <div className="button-group">
        <StatefulButton name="All" />
        <StatefulButton name="Crypto" />
        <StatefulButton name="Fiat" />
        <StatefulButton name="Commodities" />
        <StatefulButton name="Equaties" />
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
  const { yourBalance, assetsBalance, debtPool, assetsBalanceList } = useHomeData()

  return (
    <StatInfoContainer>
      <div className="summary-row">
        <div className="summary-item">
          <div className="label">Your Balance</div>
          <div className="value">${numberWithCommas(yourBalance)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Assets Balance</div>
          <div className="value">${numberWithCommas(assetsBalance)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Debt Pool</div>
          <div className="value">(${numberWithCommas(debtPool)})</div>
        </div>
      </div>
      <div className="asset-list">
        <div className="column">
          <div className="header">Asset</div>
          {
            assetsBalanceList.map(asset => (
              <div className="item" key={asset.key}>
                {
                  // safeRequire(`../../img/tokens/${asset.key}.png`) &&
                  // src={safeRequire('../../img/tokens/xBTC.png')}

                  <img
                    className="icon"
                    src={require(`../../img/tokens/${asset.key}.svg`)}
                    alt={asset.key}
                  />
                }
                {asset.key}
              </div>
            ))
          }
        </div>
        <div className="column">
          <div className="header">Qty</div>
          {
            assetsBalanceList.map(asset => (
              <div className="item" key={asset.key}>
                {/*{asset.quantity.toString()}*/}
                {numberWithCommas(asset.quantity)}
              </div>
            ))
          }
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
        </div>
      </div>
    </StatInfoContainer>
  )
}

const HomePage: React.FC = () => {
  const chainId = parseInt(process.env.CHAIN_ID!, 16)
  const RPCUrl = process.env.RPC_URL!

  const providerInitialized = useInitializeProvider(chainId, RPCUrl)
  const networkReady = useSetupNetwork(providerInitialized, {
    blockExplorerUrls: [process.env.BLOCK_EXPLORER_URL!],
    chainName: process.env.NETWORK_NAME!,
    chainId: process.env.CHAIN_ID!,
    rpcUrls: [RPCUrl]
  })

  return providerInitialized && networkReady
    ? (
      <HomePageContainer>
        <StatInfo />
        <DowsSynthesizerContainer>
          <DowsSynthesizer />
        </DowsSynthesizerContainer>
        <PairInfo />
      </HomePageContainer>
    )
    : (<></>)
}

export default HomePage
