import React from 'react'
import DowsSynthesizer from '@/components/DowsSynthesizer'
import { ContentContainer, DivContainer, DowsSynthesizerContainer } from './index.css'
import PairPanel from './PairPanel'
import StatPanel from './StatPanel'
import { KeyPair } from '@/hooks/data/useTradeData'
import { useHistory } from 'react-router-dom'

const HomePage: React.FC = () => {
  const history = useHistory()

  const onKeyPairItemClicked = (keyPair: KeyPair) => {
    history.push({
      pathname: '/trade',
      state: keyPair
    })
  }

  return (
    <div>
      <ContentContainer>
        <DivContainer>
          <StatPanel />
        </DivContainer>
        <DivContainer>
          <DowsSynthesizerContainer>
            <DowsSynthesizer />
          </DowsSynthesizerContainer>
        </DivContainer>
        <DivContainer>
          <PairPanel onItemClicked={onKeyPairItemClicked} />
        </DivContainer>
      </ContentContainer>
    </div>
  )
}

export default HomePage
