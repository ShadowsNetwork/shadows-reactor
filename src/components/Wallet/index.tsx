import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAccount, getTransactionHistoryList, setAccount, setSelectedWallet
} from '@/store/wallet'
import './index.less'
import { Button, Modal } from 'antd'
import { TransactionHistory, TransactionStatus } from '@/types/TransactionHistory'
import WalletSelectionModal from '@/components/Wallet/WalletSelectionModal'
import { ReactComponent as LinkIcon } from '@/img/link.svg'
import Jazzicon from 'jazzicon'
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons'

type CurrentAccountProps = {
  account: string
}

type WalletModalContentProps = {
  account: string,
  transactionHistoryList: TransactionHistory[]
}

const mapTransactionStatusToIconAndLabel = new Map([
  [TransactionStatus.Submitted.valueOf(), {
    icon: <LoadingOutlined />,
    label: 'Submitted',
    color: '#63cca9'
  }],
  [TransactionStatus.Completed.valueOf(), {
    // icon: <CheckOutlined />,
    color: '#63cca9'
  }],
  [TransactionStatus.Failed.valueOf(), {
    icon: <CloseOutlined />,
    color: '#de350b'
  }]
])

const WalletModalContent: React.FC<WalletModalContentProps> = ({
  account,
  transactionHistoryList
}) => {
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
        <LinkIcon
          fill="#63CCA9"
          className="link-icon"
          onClick={() => window.open(`${process.env.BLOCK_EXPLORER_URL}/address/${account}`)}
        />
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
          transactionHistoryList.map(tx => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { color, icon } = mapTransactionStatusToIconAndLabel.get(tx.status)!
            return (
              <div
                key={tx.hash}
                style={{ color }}
                className="transactionRecord"
              >
                <span className="transaction-history-string">
                  {tx.toString()}
                </span>
                {' '}
                <span className="transaction-history-status">
                  {icon}
                </span>
                {' '}
                <LinkIcon
                  fill={color}
                  className="transaction-history-link"
                  onClick={() => window.open(`${process.env.BLOCK_EXPLORER_URL}/tx/${tx.hash}`)}
                />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

const MetamaskIcon: React.FC = () => {
  const ref = useRef<HTMLDivElement>()
  const account = useSelector(getAccount)

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(Jazzicon(26, parseInt(account.slice(2, 10), 26)))
    }
  }, [account])

  return (
    <div>
      <div className="userIcon" ref={ref as any} />
    </div>
  )
}

const CurrentAccount: React.FC<CurrentAccountProps> = ({ account }) => {
  const transactionList = useSelector(getTransactionHistoryList)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pendingTransactionCount, setPendingTransactionCount] = useState<number>(0)

  useEffect(() => {
    setPendingTransactionCount(transactionList.filter(t => t.status === TransactionStatus.Submitted).length)
  }, [transactionList, pendingTransactionCount])

  const closeModal = () => {
    setIsModalVisible(false)
  }

  return (
    <div className="current-account">
      <MetamaskIcon />
      <span onClick={() => setIsModalVisible(true)}>
        {`${account.substr(0, 5)}...${account.substr(-4, 4)}`}
      </span>
      {
        pendingTransactionCount !== 0 &&
        <div className="pending-transaction-count">
          {pendingTransactionCount}
        </div>
      }
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
      <span onClick={() => setModalVisible(true)} className="toAmountText">
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
      {!account && <ConnectToWallet />}
      {!!account && <CurrentAccount account={account} />}
    </div>
  )
}

export default Wallet
