import React from 'react'
import { setLocale, getLocale } from 'umi'
import { Menu, Dropdown } from 'antd'
import '@/styles/languageDropDown.css'
import '@/styles/language.css'
import { GlobalOutlined } from '@ant-design/icons'
import i18next from 'i18next'
import { SUPPORT_LANGUAGE } from '@/i18n/Language'

function LanguageSelector() {
  const changeLang = ({ key }) => {
    setLocale(key)
    i18next.changeLanguage(key)
  }

  const selectedLang = SUPPORT_LANGUAGE.filter((lang) => lang.key === getLocale())[0]

  const langMenu = (
    <Menu selectedKeys={[selectedLang]} onClick={changeLang}>
      {SUPPORT_LANGUAGE.map((language) => (
        <Menu.Item key={language.key}>
          <span role="img" aria-label={language.name}>
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
          {selectedLang.name}
        </span>
        <div>v</div>
      </div>
    </Dropdown>
  )
}

export default LanguageSelector
