import styled from 'styled-components'

export const Box = styled.div`
  background-color: #121725;
  padding: ${props => props.padding};
  min-height: 42rem;
  height: auto;
  margin-right: 2.5rem;
  border-radius: 1rem;
`

export const DivContainer = styled.div`
`

export const HomePageContainer = styled.div`
  display: flex;
  height: fit-content;

  @media screen and (max-width: 1080px) {
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    width: 100%;
  }
`

export const DowsSynthesizerContainer = styled(Box)`
  width: 29.7rem;

  @media screen and (max-width: 1080px) {
    width: 100%;
    margin: 0 0 20px 0;
  }
`

export const StatInfoContainer = styled(Box)`
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
          width: 2.6rem;
          height: 2.6rem;
        }

        span {
          border: 2px solid #31D8A4;
          border-radius: 50%;
          margin-right: 0.5rem;
        }

        img {
          border: 2px solid #fff;
          border-radius: 50%;
          background: #FFF;
        }
      }
    }
  }

  @media screen and (max-width: 1080px) {
    width: 100%;
    margin: 0 0 20px 0;
    padding: 2rem;

    .summary-row {

      .summary-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .label {
          font-size: 12px;
        }
        
        .value {
          font-size: 20px;
        }
      }
    }
  }
`
