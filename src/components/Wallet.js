import { useWeb3React } from '@web3-react/core'
import React, { useState } from 'react'
import { useEagerConnect, useInactiveListener } from '@/web3/hooks'
import { message, Modal } from 'antd'
import { formatEther } from '@ethersproject/units'
import { LoadingOutlined } from '@ant-design/icons'
import { injected } from '@/web3/connectors'
import { useTranslation } from 'react-i18next'
import useBalanceQuery from '@/web3/useBalanceQuery'

function Balance() {
  const { loading, balance } = useBalanceQuery()

  return (
    <>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>Balance</span>
      <span>{loading && <LoadingOutlined />}</span>
      {/* eslint-disable-next-line no-nested-ternary */}
      <span>{balance === null ? 'Error' : balance ? `Ξ${formatEther(balance)}` : ''}</span>
    </>
  )
}

function CurrentAccount(props) {
  const [isModalVisible, setModalVisible] = useState(false)

  const { context } = props

  const { account } = context
  const accountStr1 = account.substr(0, 5)
  const accountStr2 = account.substr(-4, 4)
  const accountNum = `${accountStr1}...${accountStr2}`

  const openModal = () => {
    if (!props.context) {
      message.warning('无法获取钱包信息，请在 MetaMask 中重新链接')
    } else {
      setModalVisible(true)
    }
  }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <span
        style={{
          display: 'block', width: '9rem', height: '2.8rem', lineHeight: '2.8rem', fontSize: '1.3rem',
        }}
        onClick={openModal}
      >
        {accountNum}
      </span>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <Balance />
      </Modal>
    </>
  )
}

function ConnectToWallet() {
  const { activate } = useWeb3React()

  const { t } = useTranslation()

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <span onClick={() => { activate(injected) }}>{t('wallet.connectToWallet')}</span>
  )
}

function Wallet() {
  // const { connector, library, chainId, account, activate, deactivate, active, error } = context
  const context = useWeb3React()
  const { account } = context

  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain
  // events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

  return (
    <>
      {!account && <ConnectToWallet />}
      {!!account && <CurrentAccount context={context} />}
    </>
  )
}

export default Wallet
