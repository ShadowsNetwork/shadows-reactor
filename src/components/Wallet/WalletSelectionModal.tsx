import React from 'react'
import { SUPPORT_WALLETS, Wallet } from '@/web3/wallets'
import { Modal } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import './index.less'
import { getChainId, getRpcUrl } from '@/store/wallet'

type WalletCardProps = {
  wallet: Wallet
}

type WalletSelectionModalProps = {
  visible: boolean
  onClose?: () => void
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet }) => {
  const { name, icon, handleConnect } = wallet
  const dispatch = useDispatch()

  const chainId = useSelector(getChainId)
  const RPCUrl = useSelector(getRpcUrl)

  return (
    <div className="wallet-card">
      <div
        className="walletItem"
        onClick={() => chainId && RPCUrl && handleConnect(dispatch, chainId, RPCUrl)}
      >
        <span className="wallet-name">
          {name}
        </span>
        <img className="SelectImg" src={icon} alt="" />
      </div>
    </div>
  )
}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
  visible,
  onClose
}) => (
  <Modal
    className="wallet-selection-modal"
    title="Connect to wallet"
    visible={visible}
    onCancel={onClose}
    footer=""
  >
    {
      SUPPORT_WALLETS.map(wallet => (
        <WalletCard wallet={wallet} key={wallet.name} />
      ))
    }
  </Modal>
)

export default WalletSelectionModal
