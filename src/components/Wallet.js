import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getAccount, setAccount } from '@/store/wallet'

/*function Balance() {
  const {
    loading,
    balance
  } = useBalanceQuery()

  return (
    <>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>Balance</span>
      <span>{loading && <LoadingOutlined />}</span>
      {/!* eslint-disable-next-line no-nested-ternary *!/}
      <span>{balance === null ? 'Error' : balance ? `Ξ${formatEther(balance)}` : ''}</span>
    </>
  )
}*/

function CurrentAccount(props) {
  // const [isModalVisible, setModalVisible] = useState(false)

  const { account } = props

  const accountStr1 = account.substr(0, 5)
  const accountStr2 = account.substr(-4, 4)
  const accountNum = `${accountStr1}...${accountStr2}`

  /* const openModal = () => {
    setModalVisible(true)
  }*/

  return (
    <>
      <span
        style={{
          display: 'block',
          width: '9rem',
          height: '2.8rem',
          lineHeight: '2.8rem',
          fontSize: '1.3rem',
          userSelect: 'none'
        }}
        // onClick={openModal}
      >
        {accountNum}
      </span>
      {/*<Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <Balance />
      </Modal>*/}
    </>
  )
}

function ConnectToWallet() {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const activateMetamask = () => {
    if (!window.ethereum) {
      throw new Error('No metamask installed, please install it before connecting!')
    }
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        const [account] = accounts
        dispatch(setAccount(account))
      })
  }

  return (
    <span onClick={activateMetamask}>
      {t('wallet.connectToWallet')}
    </span>
  )
}

function Wallet() {
  // const { connector, library, chainId, account, activate, deactivate, active, error } = context
  const account = useSelector(getAccount)

  // const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain
  // events on the injected ethereum provider, if it exists
  // useInactiveListener(!triedEager)

  return (
    <>
      {!account && <ConnectToWallet />}
      {!!account && <CurrentAccount account={account} />}
    </>
  )
}

export default Wallet
