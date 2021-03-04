import React, { useState } from 'react'
import Action from '@/pages/Transfer/Action'
import Confirmation from '@/pages/Transfer/Confirmation'
import Completion from '@/pages/Transfer/Completion'

function Transfer() {
  // eslint-disable-next-line no-unused-vars
  const [activePageKey, setActivePageKey] = useState('ACTION')

  const [amount, setAmount] = useState('')

  const [destinationAccount, setDestinationAccount] = useState('')

  const [txHash, setTxHash] = useState('')

  const onConfirm = (_amount, _destinationAccount) => {
    setActivePageKey('CONFIRMATION')
    setAmount(_amount)
    setDestinationAccount(_destinationAccount)
  }

  const onComplete = result => {
    setActivePageKey('COMPLETION')
    setTxHash(result.hash)
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

  return PAGES[0].page
}

export default Transfer
