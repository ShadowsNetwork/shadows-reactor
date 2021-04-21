import React, {useEffect, useRef, useState} from 'react'
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
import { ReactComponent as LinkIcon } from '@/img/link.svg'
import Jazzicon from 'jazzicon'

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
const Wallet: React.FC = () => {
  const account = useSelector(getAccount)

  return (
    <div className="wallet">
      <MetamaskIcon/>
      {!account && <ConnectToWallet />}
      {!!account && <CurrentAccount account={account} />}
      <div className="pendingNum">
          1
      </div>
    </div>
  )
}

export default Wallet
