import React from 'react'
import '../styles/error.css'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

function Error(props) {
  const { location } = props
  const { code, message, from } = location
  return (
    <div className="error">
      <div className="hook">
        <div className="cha" />
      </div>
      <span>Something went wrong...</span>
      <span>
        {'Code: '}
        {code ?? 9999}
      </span>
      <span>{message ?? 'Unknown Error.'}</span>
      <Button>
        <Link to={from ?? '/'}>OK</Link>
      </Button>
    </div>
  )
}

export default Error
