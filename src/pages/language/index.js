import React from 'react'
import { getLocale, setLocale } from 'umi'
import { Dropdown, Menu } from 'antd'
import '@/styles/languageDropDown.css'
import '@/styles/language.css'
import { GlobalOutlined } from '@ant-design/icons'

export default class Header extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  changeLang({ key }) {
    setLocale(key)
  }

  render() {
    const selectedLang = getLocale()
    const locales = ['zh-CN', 'en-US']
    const languageLabels = {
      'zh-CN': '简体中文',
      'en-US': 'English',
    }
    const languageIcons = {
      'zh-CN': '🇨🇳',
      'en-US': '🇬🇧',
    }
    const langMenu = (
      <Menu selectedKeys={[selectedLang]} onClick={this.changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>
            {' '}
            {languageLabels[locale]}
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
            {' '}
            {languageLabels[selectedLang]}
          </span>
          <div>v</div>
        </div>
      </Dropdown>
    )
  }
}
