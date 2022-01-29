import styled from 'styled-components'

export const TradePageMobileLayoutContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
`

export const ContainerForDowsAndPair = styled.div`
  height: fit-content;
  border-radius: 1rem;
  width: 100%;
  margin-bottom: 0.9rem;
  background-color: #121725;
`

export const ContainerForBuyAndSell = styled.div`
  width: 100%;
  height: fit-content;
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
