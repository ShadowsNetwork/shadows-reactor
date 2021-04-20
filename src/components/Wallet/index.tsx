import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAccount, getTransactionHistoryList, setAccount, setSelectedWallet
} from '@/store/wallet'
import { PaperClipOutlined } from '@ant-design/icons'
import './index.less'
import { Button, Modal } from 'antd'
import { TransactionHistory } from '@/types/TransactionHistory'
import { mapTransactionStatusToIconAndLabel } from '@/components/TransactionStatusModal'
import WalletSelectionModal from '@/components/Wallet/WalletSelectionModal'
import share from '@/img/status/promptShare.png'

type CurrentAccountProps = {
  account: string
}

type WalletModalContentProps = {
  account: string,
  transactionHistoryList: TransactionHistory[]
}

const WalletModalContent: React.FC<WalletModalContentProps> = ({
  account,
  transactionHistoryList
}) => {
  // TODO
  const network = 'testnet'
  const dispatch = useDispatch()

  const disconnect = () => {
    dispatch(setSelectedWallet(null))
    dispatch(setAccount(null))
  }

  return (
    <div className="wallet-modal-content">
      <div className="walletModal-Title">{account}</div>
      <div className="bscScan">
        <span>View on BscScan</span>
        <img src={share} alt="" />
        <Button
          type="text"
          onClick={disconnect}
          className="disconnect"
        >
          Disconnect
        </Button>
      </div>
      <div className="transactionContent">
        {
          transactionHistoryList.map(tx => (
            <div
              key={tx.hash}
              style={{ color: mapTransactionStatusToIconAndLabel.get(tx.status)?.color }}
              className="transactionRecord"
            >
              <span className="transaction-history-string">
                {tx.toString()}
              </span>
              {' '}
              <span className="transaction-history-status">
                {mapTransactionStatusToIconAndLabel.get(tx.status)?.icon}
              </span>
              {' '}
              <img
                src={share}
                alt=""
                className="transaction-history-link"
                onClick={() => window.open(`https://${network}.bscscan.com/tx/${tx.hash}`)}
              />
            </div>
          ))
        }
      </div>
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
        style={{ top: 20 }}
        closable={false}
        maskClosable={false}
        title="Your Wallet"
        visible={isModalVisible}
        footer={null}
      >
        <WalletModalContent account={account} transactionHistoryList={transactionList} />
        <Button className="walletModalClose" onClick={closeModal}>
          Close
        </Button>
      </Modal>
    </div>
  )
}

const ConnectToWallet = () => {
  const { t } = useTranslation()

  const [modalVisible, setModalVisible] = useState<boolean>(false)

  return (
    <div className="toAmount">
      <span onClick={() => setModalVisible(true)}>
        {t('wallet.connectToWallet')}
      </span>
      <WalletSelectionModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </div>

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
