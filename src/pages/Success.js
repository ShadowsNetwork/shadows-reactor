import React from 'react'
import '../styles/success.css'
import { Button } from 'antd'

class Success extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
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
}

export default Success
