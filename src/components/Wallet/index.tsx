import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getAccount, getTransactionHistoryList, setAccount } from '@/store/wallet'
import { LinkOutlined, PaperClipOutlined } from '@ant-design/icons'
import './index.less'
import { Button, Modal } from 'antd'
import { TransactionHistory } from '@/types/TransactionHistory'
import { mapTransactionStatusToIconAndLabel } from '@/components/TransactionStatusModal'

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
  // TODO
  const network = 'testnet'

  return (
    <div className="wallet-modal-content">
      <div>{account}</div>
      <div>
        <div>View on BscScan</div>
        <div>Disconnect</div>
      </div>
      {
        transactionHistoryList.map(tx => (
          <div
            key={tx.hash}
            style={{ color: mapTransactionStatusToIconAndLabel.get(tx.status)?.color }}
          >
            <span className="transaction-history-string">
              {tx.toString()}
            </span>
            {' '}
            <span className="transaction-history-status">
              {mapTransactionStatusToIconAndLabel.get(tx.status)?.icon}
            </span>
            {' '}
            <LinkOutlined
              className="transaction-history-link"
              onClick={() => window.open(`https://${network}.bscscan.com/tx/${tx.hash}`)}
            />
          </div>
        ))
      }
    </div>
  )
}

const CurrentAccount: React.FC<CurrentAccountProps> = ({ account }) => {
  const transactionList = useSelector(getTransactionHistoryList)

  const [isModalVisible, setIsModalVisible] = useState(false)

  const closeModal = () => {
    setIsModalVisible(false)
  }

  return (
    <div className="current-account">
      <span onClick={() => setIsModalVisible(true)}>
        {`${account.substr(0, 5)}...${account.substr(-4, 4)}`}
      </span>
      <Modal
        closable={false}
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
