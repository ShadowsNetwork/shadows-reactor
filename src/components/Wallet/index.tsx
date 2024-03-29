import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getTransactionHistoryList } from '@/store/wallet'
import './index.less'
import { Button, Modal, Tooltip } from 'antd'
import {
  BridgeDows, TransactionHistory, TransactionHistoryImplementationClassType, TransactionStatus
} from '@/types/TransactionHistory'
import WalletSelectionModal from '@/components/Wallet/WalletSelectionModal'
import { ReactComponent as LinkIcon } from '@/img/link.svg'
import Jazzicon from 'jazzicon'
import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import { PolyTransactionStatus } from '@/types/PolyTransactionStatus'
import { useWeb3React } from '@web3-react/core'
import { connectorsByWallet } from '@/web3/connectors'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

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
    icon: <CheckOutlined />,
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
  const { deactivate } = useWeb3React()

  const disconnect = () => {
    deactivate()
    // TODO: handle disconnect logic for MetaMask

    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      const connector = connectorsByWallet.WalletConnect as WalletConnectConnector
      connector.close()
      connector.walletConnectProvider = null
    }
  }

  return (
    <div className="wallet-modal-content">
      <div className="walletModal-Title">
        You have been connected to: {`${account.substr(0, 6)}...${account.substr(-6, 6)}`}
      </div>
      <div className="bscScan">
        <div>
          <span className="text-label">View on BscScan</span>
          <LinkIcon
            fill="#63CCA9"
            className="link-icon"
            onClick={() => window.open(`${process.env.BLOCK_EXPLORER_URL}/address/${account}`)}
          />
        </div>
        <Button
          type="text"
          onClick={disconnect}
          className="disconnect"
        >
          Disconnect
        </Button>
      </div>
      <div className="transaction-history-container">
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
                <div className="right-box">
                  {
                    tx.TYPE === TransactionHistoryImplementationClassType.Bridge
                    && (tx as BridgeDows).state !== PolyTransactionStatus.FINISHED
                    && tx.status !== TransactionStatus.Failed
                      ? (
                        <Tooltip title={(tx as BridgeDows).hint}>
                          <span className="transaction-history-status">
                            {icon}
                          </span>
                        </Tooltip>
                      )
                      : (
                        <span className="transaction-history-status">
                          {icon}
                        </span>
                      )
                  }
                  <LinkIcon
                    fill={color}
                    className="transaction-history-link"
                    onClick={() => window.open(tx.url)}
                  />
                </div>
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
  const { account } = useWeb3React()

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
        wrapClassName="your-wallet-modal"
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
  const { account } = useWeb3React()

  return (
    <div className="wallet">
      {!account && <ConnectToWallet />}
      {!!account && <CurrentAccount account={account} />}
    </div>
  )
}

export default Wallet
