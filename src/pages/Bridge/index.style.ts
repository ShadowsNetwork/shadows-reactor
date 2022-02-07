import styled from 'styled-components'

export const BridgeContainer = styled.div`
  width: 39.1rem;
  height: fit-content;
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 1080px) {
    width: 100%;
  }

  .bridge {
    width: 100%;
    align-self: center;
    justify-self: center;
    color: white;
    background: #121725;
    border-radius: 3.757rem;
    display: flex;
    flex-direction: column;
    height: fit-content;

    .title {
      display: flex;
      align-items: center;
      margin-top: 1.6rem;
      padding: 0 2.4rem;

      .bridgeImg {
        width: 3rem;
      }

      span {
        display: inline-block;
        font-size: 1.8rem;
        margin-left: 1rem;
        font-weight: bold;
      }
    }

    .error-hint {
      margin-top: 2rem;
      color: red;
      text-align: center;
    }

    .copyright {
      color: #8d96af;
      text-align: center;
      position: relative;
      top: 5rem;
      height: 0;

      .link {
        cursor: pointer;
        margin-left: 0.3rem;
      }
    }

  }
`

export const DirectionSwitcherContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4.0rem;

  .chain {
    width: 10rem;
    height: 13.1rem;

    p {
      display: block;
      width: 100%;
      text-align: center;
      font-size: 1.8rem;
      font-weight: bold;
    }

    .chainContent {
      width: 100%;
      height: 10rem;
      background: #182037;
      border-radius: 10px;
      margin-top: 0.7rem;
      letter-spacing: -0.2px;
    }

    img {
      width: 3.6rem;
      margin-left: calc((100% - 3.6rem) / 2);
      margin-top: 1.1rem;
    }

    span {
      display: block;
      text-align: center;
      margin-top: 0.4rem;
      font-size: 1.4rem;
      font-weight: bold;
      width: 5.7rem;
      margin-left: calc((100% - 5.7rem) / 2);
    }
  }

  .switch {
    width: 4rem;
    height: 2.8rem;
    margin-top: 5rem;
    margin-left: 2.3rem;
    margin-right: 2.3rem;
  }


`

export const BridgeFormContainer = styled.div`
  padding: 0 1.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .available {
    color: #63CCA9;
    font-weight: bold;
    margin-top: 3.3rem;
    text-align: end;
    margin-right: 0.3rem;
  }

  .input-row {
    display: flex;
    align-items: center;
    margin-top: 1rem;

    input.ant-input {
      width: 19.2rem;
      height: 3.8rem;
      background: #363636;
      border-radius: 3.8rem;
      border: none;
      outline: none;
    }

    .DOWS {
      font-size: 1.5rem;
      font-weight: bold;
      color: #63CCA9;
      margin-left: 2rem;
    }

    Button {
      width: 8.567rem;
      height: 3.757rem;
      border-radius: 2rem;
      color: #FFFEFE !important;
      font-size: 1.5rem;
      font-weight: bold;
      background: #63CCA9 !important;
      border: none;
      margin-left: 1.8rem;
    }
  }

  .fee {
    font-size: 1.5rem;
    font-weight: bold;
    color: #63CCA9;
    margin-top: 3.5rem;
    margin-bottom: 0.4rem;
    text-align: center;
  }

  .convert-button {
    Button {
      width: 15.979rem;
      height: 3.757rem;
      border-radius: 2rem;
      color: #FFFEFE !important;
      font-size: 1.5rem;
      font-weight: bold;
      background: #63CCA9 !important;
      border: none;
      margin-left: calc((100% - 15.979rem) / 2);
    }
  }
`
