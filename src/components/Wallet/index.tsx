import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAccount, getSelectedWallet, getTransactionHistoryList, setAccount, setSelectedWallet
} from '@/store/wallet'
import './index.less'
import { Button, Modal, Tooltip } from 'antd'
import {
  BridgeDows,
  TransactionHistory, TransactionHistoryImplementationClassType, TransactionStatus
} from '@/types/TransactionHistory'
import WalletSelectionModal from '@/components/Wallet/WalletSelectionModal'
import { ReactComponent as LinkIcon } from '@/img/link.svg'
import Jazzicon from 'jazzicon'
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import { getWeb3ProviderByWallet, WalletNames } from '@/web3/wallets'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { PolyTransactionStatus } from '@/types/PolyTransactionStatus'

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
  const selectedWallet = useSelector(getSelectedWallet) as WalletNames

  const disconnect = async () => {
    dispatch(setSelectedWallet(null))
    dispatch(setAccount(null))

    if (selectedWallet === 'WalletConnect') {
      const chainId: number = parseInt(process.env.CHAIN_ID!, 16)
      const RPCUrl: string = process.env.RPC_URL!
      const provider = await getWeb3ProviderByWallet({ chainId, RPCUrl }, selectedWallet)
      const walletConnectProvider = provider?.provider as WalletConnectProvider
      walletConnectProvider.disconnect()
    }
  }

  return (
    <div className="wallet-modal-content">
      <div className="walletModal-Title">{account}</div>
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
                <div>
                  {
                    tx.TYPE === TransactionHistoryImplementationClassType.Bridge && (tx as BridgeDows).state !== PolyTransactionStatus.FINISHED ?
                      <Tooltip title={(tx as BridgeDows).hint}>
                        <span className="transaction-history-status">
                          {icon}
                        </span>
                      </Tooltip>
                      : <span className="transaction-history-status">
                        {icon}
                      </span>
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
        wrapClassName="wallet-modal-wrapper"
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
