import React from 'react'
import { SUPPORT_WALLETS, Wallet } from '@/web3/wallets'
import { Modal } from 'antd'
import { useDispatch } from 'react-redux'

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
    <div onClick={() => handleConnect(dispatch)}>
      <div className="wallet-name">
        {name}
      </div>
      <div className="wallet-icon">
        <img src={icon} alt="" />
      </div>
    </div>
  )

}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
  visible,
  onClose
}) => (
  <Modal
    visible={visible}
    onCancel={onClose}
    footer={<></>}
  >
    {
      SUPPORT_WALLETS.map(wallet => (
        <WalletCard wallet={wallet} key={wallet.name} />
      ))
    }
  </Modal>
)

export default WalletSelectionModal
