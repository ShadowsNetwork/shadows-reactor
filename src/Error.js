import React from 'react'
import './css/error.css'

class Error extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div className="error">
        <div className="hook">
          <div className="cha"/>
        </div>
        <span>Something went wrong...</span>
        <span>Code:4001</span>
        <span>User denied transaction signature</span>
        <button>OK</button>
      </div>
    )
  }
}

export default Error
