import React from 'react'
import styled from 'styled-components'
import { numberWithCommas } from '@/utils'
import DowsSynthesizer from '@/components/DowsSynthesizer'
import { useCurrencyData } from '@/hooks/useTradeData'
import { useHomeData } from '@/hooks/useHomeData'
import { useHistory } from 'react-router-dom'
import { toBigNumber } from '@/web3/utils'

const Box = styled.div`
  background-color: #121725;
  padding: ${props => props.padding};
  min-height: 42rem;
  height:auto;
  margin-right: 2.5rem;
  border-radius: 1rem;
`

const DivContainer = styled.div`
`

const ContentContainer = styled.div`
  display:flex;
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
      cursor: pointer;
      transition: all 0.2s linear;
      &:hover{
        transform:translate(0, 2px);
        color: #979797;
        // text-decoration: underline;
      }
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
  /* const [selectedType, setSelectedType] = useState('All')

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
  }*/

  const history = useHistory()

  const { keyPairs } = useCurrencyData()

  return (
    <PairsInfoContainer>
      {/*<div className="button-group">
        <StatefulButton name="All" />
        <StatefulButton name="Crypto" />
        <StatefulButton name="Fiat" />
        <StatefulButton name="Commodities" />
        <StatefulButton name="Equaties" />
      </div>*/}
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
  const { yourBalance, assetsBalance, debtPool, assetsBalanceList, netTradingBalance } = useHomeData()

  const newNetTradingBalance = netTradingBalance >= toBigNumber(0) ? `$${numberWithCommas(netTradingBalance)}` : numberWithCommas(netTradingBalance).replace('-', '-$');
  return (
    <StatInfoContainer>
      <div className="summary-row">
        <div className="summary-item">
          <div className="label">Your Balance</div>
          <div className="value">${numberWithCommas(yourBalance)}</div>
        </div>
        <div className="summary-item">
          <div className="label">DOWS Balance</div>
          <div className="value">${numberWithCommas(assetsBalance)}</div>
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
          <div className="item">({numberWithCommas(debtPool)})</div>
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
