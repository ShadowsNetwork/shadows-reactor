import React, { useState } from 'react'
import Action from '@/pages/Transfer/Action'
import Confirmation from '@/pages/Transfer/Confirmation'
import Completion from '@/pages/Transfer/Completion'

function Transfer() {
  const [activePageKey, setActivePageKey] = useState('ACTION')

  const [amount, setAmount] = useState('')

  const [destinationAccount, setDestinationAccount] = useState('')

  const [txHash, setTxHash] = useState('')

  const onConfirm = (_amount, _destinationAccount) => {
    setActivePageKey('CONFIRMATION')
    setAmount(_amount)
    setDestinationAccount(_destinationAccount)
  }

  const onComplete = (_txHash) => {
    setActivePageKey('COMPLETION')
    setTxHash(_txHash)
  }

  const PAGES = [
    {
      key: 'ACTION',
      page: <Action
        onConfirm={onConfirm}
        onComplete={onComplete}
      />,
    },
    {
      key: 'CONFIRMATION',
      page: <Confirmation
        amount={amount}
        destinationAccount={destinationAccount}
      />,
    },
    {
      key: 'COMPLETION',
      page: <Completion
        amount={amount}
        destinationAccount={destinationAccount}
        txHash={txHash}
      />,
    },
  ]

  return PAGES.filter((p) => (p.key === activePageKey))[0].page
}

export default Transfer
