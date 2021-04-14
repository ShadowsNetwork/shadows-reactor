import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getAccount, setAccount } from '@/store/wallet'
import { LinkOutlined, Loading3QuartersOutlined, PaperClipOutlined } from '@ant-design/icons'
import './index.less'
import { Button, Modal } from 'antd'
import {
  DepositLPToken,
  RedeemDowsTransaction,
  TransactionHistory,
  WithdrawLPToken
} from '@/store/TransactionHistory/type'

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

type CurrentAccountProps = {
  account: string
}

type WalletDetailModalProps = {
  account: string,
  transactionHistoryList: TransactionHistory[]
}

const WalletModalContent: React.FC<WalletDetailModalProps> = ({
  account,
  transactionHistoryList
}) => {
  return (
    <>
      <div>{account}</div>
      <div>
        <div>View on BscScan</div>
        <div>Disconnect</div>
      </div>
      {
        transactionHistoryList.map(transaction => (
          <div key={transaction.hash}>
            <span className="transaction-history-string">
              {transaction.toString()}
            </span>
            <span className="transaction-history-status">
              <Loading3QuartersOutlined />
            </span>
            <span className="transaction-history-link">
              <LinkOutlined />
            </span>
          </div>
        ))
      }
    </>
  )
}

const CurrentAccount: React.FC<CurrentAccountProps> = ({ account }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const closeModal = () => {
    setIsModalVisible(false)
  }

  // TODO: fetch data from redux
  const transactionList = [
    new WithdrawLPToken('0xffffffffff', '1.25'),
    new DepositLPToken('0xffffffffff', '1.22'),
    new RedeemDowsTransaction('0xffffffffff', '1.21')
  ]

  return (
    <div className="current-account">
      <span onClick={() => setIsModalVisible(true)}>
        {`${account.substr(0, 5)}...${account.substr(-4, 4)}`}
      </span>
      <Modal
        maskClosable={false}
        title="Your Wallet"
        visible={isModalVisible}
        footer={
          <Button onClick={closeModal}>
            Close
          </Button>
        }
      >
        <WalletModalContent account={account} transactionHistoryList={transactionList} />
      </Modal>
    </div>
  )
}

const ConnectToWallet = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { ethereum } = window as WindowChain

  const activateMetamask = () => {
    if (!ethereum) {
      throw new Error('No metamask installed, please install it before connecting!')
    }

    ethereum.request?.({ method: 'eth_requestAccounts' })
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

const Wallet: React.FC = () => {
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
