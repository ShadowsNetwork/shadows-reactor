import styled from 'styled-components'

export const TradePageContainer = styled.div`
  display: flex;
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

export const CandlestickContainer = styled.div`
  height: 55.2rem;
  margin-bottom: 1.5rem;
  background-color: #121725;
  padding: 2.4rem 1.5rem 2rem;

  .title {
    font-size: 2.8rem;
    font-weight: bold;
    color: white;
    margin-bottom: 0.8rem;
    span{
      border:2px solid #31D8A4;
      border-radius:50%;
      margin-right: 0.6rem;
      display:inline-block;
      height:3.6rem;
      width:3.6rem;
      vertical-align:middle;
      line-height:0;
    }
    img {
      width: 3.2rem;
      height: 3.2rem;
      border:2px solid #fff;
      border-radius:50%;
      font-size:0;
      background:#FFF;
    }
  }

  .price-info {
    display: flex;
    align-items: center;
    line-height: 1;
    margin-bottom: 0.8rem;

    .current {
      font-size: 2.8rem;
      color: white;
      margin-right: 0.5rem;
      font-weight: bold;
    }

    .change {
      font-size: 2.2rem;
      font-weight: 500;
      margin-left: 1rem;
    }
  }

  .time-select-btn-group {
    text-align: end;
    //margin-bottom: 1.08rem;

    .btn {
      padding: 0;
      width: 2.555rem;
      height: 2.457rem;
      margin-right: 0.345rem;

      font-size: 0.9rem;
      font-weight: 400;
      color: white;
      border-width: 1px;
      border-color: #63CCA9;
      border-radius: 5px;
    }
  }

  .title, .price-info, .time-select-btn-group {
    padding: 0;
  }

  .trading-view-container {
    padding-top: 2rem;
    margin-bottom: 1.2rem;
  }

  .bottom-btn-group {
    text-align: end;
    margin-bottom: 1rem;
    padding-top: 0.5rem;

    .btn {
      padding: 0;
      width: 7.2rem;
      height: 2.457rem;
      margin-left: 1rem;
      margin-right: 0.5rem;
      font-size: 0.9rem;
      color: white;
      border-width: 1px;
      border-color: #63CCA9;
      border-radius: 5px;

      &:hover {
        border-color: #ffffff;
      }
    }
  }
`

export const StatsContainer = styled.div`
  height: 8.8rem;
  display: flex;
  align-items: center;
  background-color: #1C1C1C;
  justify-content: space-around;

  .item {
    // font-family: "DM sans";
    font-weight: bold;
    //line-height: 12;

    .title {
      color: #939393;
      // margin-bottom: 0.4rem;
      font-size: 1.2rem;
    }

    .value {
      color: white;
      font-size: 2rem;
    }
  }
`

export const ContainerForDowsAndPair = styled.div`
  height: 41rem;
  margin-bottom: 0.9rem;
  background-color: #121725;
`

export const ContainerForBuyAndSell = styled.div`
  height: 19.8rem;
  background-color: #121725;
  padding: 1.6rem 1.6rem;
  border-radius:0 0 10px 10px !important;

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

export const PairsInfoContainer = styled.div`
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
      cursor: pointer;
      user-select: none;
      transition: all 0.2s linear;
      &:hover{
        transform:translate(0, 2px);
      }
    }

    .header {
      padding: 0 1.2rem;
      color: #979797 !important;
      font-size: 1.2rem;
      user-select: none;
    }
    .content{
      padding: 0 1.2rem;
      height: 23em;
      overflow: auto;
    }
  }
`

export const CustomizedSlider = styled.div`
  .ant-slider-dot {
    background-color: #cccccc;
    height: 14px;
    width: 14px;
    border: 0;
    margin-left: -7px;
    top: -5px;
  }

  .ant-slider-step {
    background: rgba(255, 255, 255, .2);
  }

  .ant-slider-dot-active {
    border-color: ${props => props.color};
    background-color: white;
  }

  .ant-slider-with-marks {
    margin: 1.6rem 0;
  }

  .ant-slider-handle {
    height: 20px;
    width: 20px;
    background-color: white;
    border-width: 5px;
    margin-top: -9px;
  }
`

export const SellBuyTabs = styled.div`
  display:flex;

  div{
    cursor: pointer;
    height:3.6rem;
    width:50%;
    text-align:center;
    background-color: #121725;
    line-height:3.6rem;
    border-radius:10px 10px 0 0;
    font-size:1.6rem;
    font-weight: bold;
    &:hover{
      transform: translate(0, 1px);
    }
  }
  .buy{
    color:#63CCA9;
    margin-right:0.5rem;
  }
  .sell{
    color:#DB5E56;
    margin-left:0.5rem
  }
`