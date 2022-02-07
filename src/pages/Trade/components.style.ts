import styled from 'styled-components'

export const CandlestickContainer = styled.div`
  height: 55.2rem;
  margin-bottom: 1.5rem;
  background-color: #121725;
  padding: 2.4rem 1.5rem 2rem;
  border-radius: 1rem;

  .title {
    font-size: 2.8rem;
    font-weight: bold;
    color: white;
    margin-bottom: 0.8rem;

    span {
      border: 2px solid #31D8A4;
      border-radius: 50%;
      margin-right: 0.6rem;
      display: inline-block;
      height: 3.6rem;
      width: 3.6rem;
      vertical-align: middle;
      line-height: 0;
    }

    img {
      width: 3.2rem;
      height: 3.2rem;
      border: 2px solid #fff;
      border-radius: 50%;
      font-size: 0;
      background: #FFF;
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

  @media screen and (max-width: 1080px) {
    width: 100%;
    height: fit-content;
  }
`

export const StatsContainer = styled.div`
  height: 8.8rem;
  display: flex;
  align-items: center;
  background-color: #1C1C1C;
  justify-content: space-around;
  border-radius: 1rem;

  .item {
    font-weight: bold;

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

  @media screen and (max-width: 1080px) {
    width: 100%;
    padding: 4px;
    margin-bottom: 30px;
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
