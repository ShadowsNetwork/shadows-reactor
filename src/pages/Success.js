import React from 'react'
import '../styles/success.css'
import { Button } from 'antd'

function Success() {
  return (
    <div className="success">
      <div className="hook">
        <i />
      </div>
      <span>Success</span>
      <span>I am successful prompt copy</span>
      <Button>OK</Button>
    </div>
  )
}

export default Success
