import styled from 'styled-components'

export const StakingPageContainer = styled.div`
  display: flex;

  @media screen and (max-width: 1080px) {
    display: grid;
    grid-template-rows: repeat(auto-fill, 2fr);
    grid-row-gap: 2rem;
    height: fit-content;
  }
`

export const PoolContainer = styled.div`
  margin-right: 2.0rem;
  height: fit-content;
  width: 41rem;

  @media screen and (max-width: 1080px) {
    margin-right: 0;
    width: 100%;
  }
`

export const PoolTitle = styled.div`
  width: 100%;
  height: 6.641rem;
  background: #1B1D21;
  border-radius: 1rem;
  display: flex;
  align-items: center;

  span {
    font-weight: bold;
    font-size: 18px;
    line-height: 23px;
    letter-spacing: -0.2px;
    color: #FFFFFF;
    margin-left: 3rem;
  }
`

export const PoolContentContainer = styled.div`
  background: #121725;
  width: 100%;
  margin-top: 1rem;
  border-radius: 1rem;
  padding: 2.9rem 2.3rem;
  height: fit-content;

  .info-container-title {
    font-size: 2.8rem;
    font-weight: bold;
    color: #fff;
    letter-spacing: -0.2px;
  }

  .infoContent-dows {
    width: 3rem;
    position: relative;
    right: 1.5rem;
    top: 1.5rem;
  }

  .title {
    font-weight: bold;
    letter-spacing: -0.02rem;
  }

  .value {
    font-weight: bold;
    letter-spacing: -0.02rem;
  }

  .additional {
    font-size: 1.6rem;
    letter-spacing: 0.3rem;
  }

  img {
    width: 4.4rem;
    margin-top: 1.4rem;
  }

  .info-container {
    display: flex;
    align-content: flex-start;
    flex-flow: row wrap;

    .item {
      color: white;
      flex: 0 0 50%;
      margin-bottom: 2.5rem;
      margin-top: 5.1rem;

      .title {
        color: #63cca9;
        font-size: 1.4rem;
      }

      .value {
        font-size: 2.8rem;

        @media screen and (max-width: 1080px) {
          font-size: 2.4rem;
        }
      }

      .additional {
        color: #989898;
      }
    }
  }

  .button-container {
    display: flex;

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #63CCA9;
      border: none;
    }

    button:active {
      background: none;
    }

    .approve {
      color: #fff;
      font-weight: bold;
      width: 9.354rem;
      height: 3.757rem;
      border-radius: 3.757rem;
      margin-left: 0.607rem;
      margin-right: 3.125rem;
    }

    .lock {
      width: 3.492rem;
      height: 3.757rem;
      border-radius: 3.492rem;
      background: #63CCA9;
      border: none;
    }

    .unlock {
      color: #fff;
      font-weight: bold;
      width: 10.354rem;
      height: 3.757rem;
      border-radius: 3.757rem;
      margin-left: 0.607rem;
    }

    .redeem {
      width: 9.187rem;
      height: 3.757rem;
      border-radius: 3.757rem;;
      color: #fff;
      font-weight: bold;
      margin-left: 5.438rem;
    }
  }

  @media screen and (max-width: 1080px) {
    padding: 1.5rem;
  }
`
