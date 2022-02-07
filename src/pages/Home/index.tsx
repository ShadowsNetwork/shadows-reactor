import React from 'react'
import DowsSynthesizer from '@/components/DowsSynthesizer'
import { DowsSynthesizerContainer, HomePageContainer } from './index.css'
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
    <HomePageContainer>
      <StatPanel />
      <DowsSynthesizerContainer>
        <DowsSynthesizer />
      </DowsSynthesizerContainer>
      <PairPanel onItemClicked={onKeyPairItemClicked} />
    </HomePageContainer>
  )
}

export default HomePage
