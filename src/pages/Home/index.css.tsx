import styled from 'styled-components'

const Box = styled.div`
  background-color: #121725;
  padding: ${props => props.padding};
  min-height: 42rem;
  height:auto;
  margin-right: 2.5rem;
  border-radius: 1rem;
`

export const DivContainer = styled.div`
`

export const ContentContainer = styled.div`
  display:flex;
`

export const DowsSynthesizerContainer = styled(Box)`
  width: 29.7rem;
`

export const PairsInfoContainer = styled(Box)`
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
        span{
          border:2px solid #31D8A4;
          border-radius:50%;
          margin-right: 0.5rem;
        }
        img{
          border:2px solid #fff;
          border-radius:50%;
          background:#FFF;
        }
      }
    }


  }
`