import React from 'react'
import { SUPPORT_WALLETS, Wallet } from '@/web3/wallets'
import { Modal } from 'antd'
import { useDispatch } from 'react-redux'
import './walletSelect.less'

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

  return (
    <div className="walletSelect">
      <div className="walletItem" onClick={() => handleConnect(dispatch)}>
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
