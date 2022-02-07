import styled from 'styled-components'

export const TradePageContainer = styled.div`
  display: flex;
  width: 120rem;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.width};
  margin-right: ${props => props.marginRight};

  div {
    border-radius: 10px;
  }
`

export const ContainerForDowsAndPair = styled.div`
  height: 41rem;
  width: 100%;
  margin-bottom: 0.9rem;
  background-color: #121725;
  border-radius: 1rem;
`

export const ContainerForBuyAndSell = styled.div`
  height: 19.8rem;
  background-color: #121725;
  padding: 1.6rem 1.6rem;
  border-radius: 0 0 10px 10px !important;

  .panel {
    display: flex;
    flex-direction: column;
    justify-content: start;
  }

  .input {
    height: 3.757rem;
    border-radius: 2rem;
    background-color: #363636;
  }

  .row {
    display: flex;
    align-items: center;
  }

  .unit {
    color: #63CCA9;
    font-weight: bold;
    font-size: 1.4rem;
    margin-left: 1.6rem;
  }

  .info-row {
    justify-content: space-between;
    color: white;
    font-size: 1.4rem;
    font-weight: bold;
  }

  @font-face {
    font-family: "helveticaneue-bold";
    src: url("/fonts/Helvetica Neu Bold.ttf") format("woff"),
    url("/fonts/Helvetica Neu Bold.ttf") format("opentype"),
    url("/fonts/Helvetica Neu Bold.ttf") format("truetype");
  }

  .btn {
    margin-top: 0.8rem;
    width: 100%;
    height: 3.757rem;
    border-radius: 1rem;
    color: white;
    font-family: "helveticaneue-bold";
    font-size: 1.5rem;
    font-weight: bold;
    transition: all 0.2s linear;

    &:hover {
      transform: translate(0, 4px);
    }

    &[disabled] {
      &:hover {
        transform: translate(0, 0);
      }
    }
  }
`

export const SellBuyTabs = styled.div`
  display: flex;
  width: 100%;

  div {
    cursor: pointer;
    height: 3.6rem;
    width: 50%;
    text-align: center;
    background-color: #121725;
    line-height: 3.6rem;
    border-radius: 10px 10px 0 0;
    font-size: 1.6rem;
    font-weight: bold;

    &:hover {
      transform: translate(0, 1px);
    }
  }

  .buy {
    color: #63CCA9;
    margin-right: 0.5rem;
  }

  .sell {
    color: #DB5E56;
    margin-left: 0.5rem
  }
`
