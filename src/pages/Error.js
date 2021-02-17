import React from 'react'
import '../styles/error.css'
import { Button } from 'antd'

class Error extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
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
}

export default Error
