import React from 'react'
import '../../styles/flow.css'
import { Link } from 'react-router-dom'
import { formatMessage } from 'umi'

function Flow() {
  return (
    <div className="flow">
      <div className="flow-title">
        <span>{formatMessage({ id: 'fluidity.title' })}</span>
        <span>{formatMessage({ id: 'fluidity.text' })}</span>
      </div>
      <div className="flow-content">
        <Link to="/FlowStep" className="flow-content-main">
          <span>iBTC</span>
          <span>iBTC</span>
          <span>weekly rewards</span>
          <span>18000 DOWS</span>
        </Link>
        <Link to="/FlowStep" className="flow-content-main">
          <span>xETH</span>
          <span>xETH</span>
          <span>weekly rewards</span>
          <span>8000 DOWS</span>
        </Link>
        <Link to="/FlowStep" className="flow-content-main">
          <span>xETH</span>
          <span>xETH</span>
          <span>weekly rewards</span>
          <span>8000 DOWS</span>
        </Link>
      </div>
    </div>
  )
}

export default Flow
