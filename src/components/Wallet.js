import { useWeb3React, Web3ReactProvider } from '@web3-react/core'
import React from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useEagerConnect, useInactiveListener } from '@/web3/hooks'
import { injected } from '@/web3/connectors'

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function WalletConnector() {
  const context = useWeb3React()
  // const { connector, library, chainId, account, activate, deactivate, active, error } = context
  const { account, activate } = context


  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

  return (<span
    onClick={() => {
      activate(injected)
    }}
  >
    {account ? account : '链接钱包'}
  </span>
  )
}


const Wallet = () => (<Web3ReactProvider getLibrary={getLibrary}>
  <WalletConnector />
</Web3ReactProvider>)

export default Wallet
