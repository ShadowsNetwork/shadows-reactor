import { Button } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { usePairData, useSynthAssetsData } from '@/pages/Trade/TradeDataHooks'
import { useInitializeProvider, useSetupNetwork } from '@/hooks'
import { useHomeData } from '@/pages/Home/HomeDataHooks'
import { numberWithCommas, safeRequire } from '@/utils'
import { useHistory } from 'react-router-dom'

const Box = styled.div`
  background-color: #121725;
  padding: 1.5rem 1.5rem;
  height: 36.8rem;
  margin-right: 2.5rem;
  border-radius: 1rem;
`

const HomePageContainer = styled.div`
  display: flex;
`

const DowsInfoContainer = styled(Box)`
  width: 29.7rem;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .header {
    width: 100%;
    margin-bottom: 2.4rem;
    display: flex;
    justify-content: space-around;

    .item {
      font-weight: bold;
      display: flex;
      flex-direction: column;
      align-items: center;

      .title {
        white-space: nowrap;
        color: #63CCA9;
        font-size: 1.2rem;
      }

      .value {
        color: white;
        font-size: 2rem;
      }
    }
  }

  .button-row {
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin: 0 0.6rem 2.7rem 0.6rem;

    .button {
      width: 45%;
      color: white;
      height: 3.757rem;
      border-radius: 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      border-width: 0.2rem;
      border-color: #979797;
    }
  }

  .text-container {
    width: 85%;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 0.6;
    margin-bottom: 2.0rem;

    .bold {
      font-size: 1.3rem;
      color: #979797;
    }

    p {
      display: flex;
      justify-content: space-between;
    }
  }

  .redeem-btn {
    margin: 0 auto;
    width: 14rem;
    height: 3.757rem;
    color: white;
    font-weight: bold;
    font-size: 1.5rem;

    border-width: 0.2rem;
    border-radius: 1rem;
    border-color: #979797;
  }
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

const DowsInfo: React.FC = () => {
  const history = useHistory()

  const {
    myRatio, targetRatio,
    totalDows, availableDows, lockedDows,
    totalReward, escrowedReward, redeemableReward,
  } = useSynthAssetsData()

  const goToTradePage = () => history.push('/trade')

  return (
    <DowsInfoContainer>
      <div className="header">
        <div className="item">
          <div className="title">Current Collateral</div>
          <div className="value">{myRatio}</div>
        </div>
        <div className="item">
          <div className="title">Target Collateral</div>
          <div className="value">{targetRatio}</div>
        </div>
      </div>
      <div className="button-row">
        <Button className="button" onClick={goToTradePage}>
          Mint xUSD
        </Button>
        <Button className="button" onClick={goToTradePage}>
          Burn xUSD
        </Button>
      </div>
      <div className="text-container">
        <p className="bold">
          <span>Total DOWS</span>
          <span>{totalDows}</span>
        </p>
        <p>
          <span>Available</span>
          <span>{availableDows}</span>
        </p>
        <p>
          <span>Locked</span>
          <span>{lockedDows}</span>
        </p>
      </div>
      <div className="text-container">
        <p className="bold">
          <span>Total Rewards</span>
          <span>{totalReward}</span>
        </p>
        <p>
          <span>Escrowed</span>
          <span>{escrowedReward}</span>
        </p>
        <p>
          <span>Redeemable</span>
          <span>{redeemableReward}</span>
        </p>
      </div>
      <Button className="redeem-btn" onClick={goToTradePage}>Redeem</Button>

    </DowsInfoContainer>
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
                {asset.key}
                {
                  safeRequire(`../../img/tokens/${asset.key}.png`) &&
                  <img
                    className="icon"
                    src={safeRequire(`../../img/tokens/${asset.key}.png`)}
                    alt={asset.key}
                  />
                }
              </div>
            ))
          }
        </div>
        <div className="column">
          <div className="header">Qty</div>
          {
            assetsBalanceList.map(asset => (
              <div className="item" key={asset.key}>
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
        <DowsInfo />
        <PairInfo />
      </HomePageContainer>
    )
    : (<></>)
}

export default HomePage
