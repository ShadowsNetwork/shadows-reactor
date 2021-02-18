import React from 'react'
import '../styles/error.css'
import { Button } from 'antd'

function Error() {
  return (
    <div className="error">
      <div className="hook">
        <div className="cha" />
      </div>
      <span>Something went wrong...</span>
      <span>Code:4001</span>
      <span>User denied transaction signature</span>
      <Button>OK</Button>
    </div>
  )
}

export default Error
