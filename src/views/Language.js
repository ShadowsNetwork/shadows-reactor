import React from 'react'
import '../styles/languageDropDown.css'
import { Menu, Dropdown } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import '../styles/language.css'

const menu = (
  <Menu>
    <Menu.Item>
      <span
        style={{
          display: 'inline-block',
          width: '15px',
          height: '15px',
          borderRadius: '15px',
          background: '#4444FF',
        }}
      />
      <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>
        Chinese
      </span>
    </Menu.Item>
    <Menu.Item>
      <span
        style={{
          display: 'inline-block',
          width: '15px',
          height: '15px',
          borderRadius: '15px',
          background: '#03AF91',
        }}
      />
      <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>
        English
      </span>
    </Menu.Item>
    <Menu.Item>
      <span
        style={{
          display: 'inline-block',
          width: '15px',
          height: '15px',
          borderRadius: '15px',
          background: '#D2417E',
        }}
      />
      <span style={{ marginLeft: '10px', color: '#B9B1B7', fontSize: '8pt' }}>
        French
      </span>
    </Menu.Item>
  </Menu>
)

function Language() {
  return (
    <Dropdown overlay={menu} placement="bottomLeft" arrow>
      <div className="language">
        <GlobalOutlined style={{ fontSize: '16px', color: '#fff' }} />
        <span style={{ marginLeft: '5px' }}>中/CN</span>
        <div>v</div>
      </div>
    </Dropdown>
  )
}

export default Language
