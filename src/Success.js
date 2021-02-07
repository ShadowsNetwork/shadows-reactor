import React from 'react'
import './css/success.css'


class Success extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="success">
        <div className="hook">
          <i/>
        </div>
        <span>Success</span>
        <span>I am successful prompt copy</span>
        <button>OK</button>
      </div>
    )
  }
}

export default Success
