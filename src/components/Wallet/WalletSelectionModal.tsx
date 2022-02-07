import React from 'react'
import { Modal } from 'antd'
import './index.less'
import { supportWallets, Wallet } from '@/web3/connectors'
import { useWeb3React } from '@web3-react/core'

type WalletSelectionModalProps = {
  visible: boolean
  onClose?: () => void
}

const WalletCard: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
  const { activate } = useWeb3React()
  const { name, icon, connector } = wallet

  const prepareToConnect = () => {
    activate(connector)
  }

  return (
    <div className="wallet-card">
      <div
        className="walletItem"
        onClick={prepareToConnect}
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
      supportWallets.map(wallet => (
        <WalletCard wallet={wallet} key={wallet.name} />
      ))
    }
  </Modal>
)

export default WalletSelectionModal
