import React from 'react'
import { Menu, Dropdown } from 'antd'
import '@/styles/languageDropDown.css'
import '@/styles/language.css'
import { GlobalOutlined } from '@ant-design/icons'
import i18next from 'i18next'
import { SUPPORT_LANGUAGE } from '@/i18n/Language'
import { useTranslation } from 'react-i18next'

function LanguageSelector() {
  const changeLanguage = ({ key }) => {
    i18next.changeLanguage(key)
  }

  const { i18n } = useTranslation()
  const currentLanguage = SUPPORT_LANGUAGE.filter((lang) => lang.key === i18n.language)[0]

  const langMenu = (
    <Menu selectedKeys={[currentLanguage.key]} onClick={changeLanguage}>
      {SUPPORT_LANGUAGE.map((language) => (
        <Menu.Item key={language.key}>
          <span role="img" aria-label={language.name} style={{ marginRight: '5px' }}>
            {language.icon}
          </span>
          {language.name}
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Dropdown overlay={langMenu} placement="bottomLeft" arrow>
      <div className="language">
        <GlobalOutlined
          style={{
            fontSize: '16px',
            color: '#fff',
          }}
        />
        <span style={{ marginLeft: '5px' }}>
          {currentLanguage.name}
        </span>
        <div>v</div>
      </div>
    </Dropdown>
  )
}

export default LanguageSelector
