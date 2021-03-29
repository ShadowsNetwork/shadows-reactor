import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getAccount, setAccount } from '@/store/wallet'
import { PaperClipOutlined } from '@ant-design/icons'
import './index.less'

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

const CurrentAccount = ({ account }) => {
  // const [isModalVisible, setModalVisible] = useState(false)

  /* const openModal = () => {
    setModalVisible(true)
  }*/

  return (
    <div className="current-account">
      <span>
        {`${account.substr(0, 5)}...${account.substr(-4, 4)}`}
      </span>
      {/*<Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <Balance />
      </Modal>*/}
    </div>
  )
}

const ConnectToWallet = () => {
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

const Wallet = () => {
  const account = useSelector(getAccount)

  return (
    <div className="wallet">
      <PaperClipOutlined className="icon" />
      {!account && <ConnectToWallet />}
      {!!account && <CurrentAccount account={account} />}
    </div>
  )
}

export default Wallet
