import React, { useCallback, useEffect, useState } from 'react'
import '../../styles/personal.css'
import { Progress } from 'antd'
import { useTranslation } from 'react-i18next'
import { LoadingOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'

function Personal() {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [xUSD, setXUSD] = useState(null)
  const [xJPY, setXJPY] = useState(null)
  const [xAUD, setXAUD] = useState(null)
  const [xEUR, setXEUR] = useState(null)
  const dows = 0
  const myRatio = ''
  const targetRatio = ''
  const transferableShadows = ''
  const lockedShadows = ''

  const getSynthBalance = useCallback(async () => {
    const [xUSDBalance, xJPYBalance, xAUDBalance, xEURBalance] = await Promise.all([
      dowsJSConnector.dowsJs.SynthxUSD.balanceOf(account),
      dowsJSConnector.dowsJs.SynthxJPY.balanceOf(account),
      dowsJSConnector.dowsJs.SynthxAUD.balanceOf(account),
      dowsJSConnector.dowsJs.SynthxEUR.balanceOf(account),
    ])

    setXUSD(dowsJSConnector.dowsJs.util.formatEther(xUSDBalance))
    setXJPY(dowsJSConnector.dowsJs.util.formatEther(xJPYBalance))
    setXAUD(dowsJSConnector.dowsJs.util.formatEther(xAUDBalance))
    setXEUR(dowsJSConnector.dowsJs.util.formatEther(xEURBalance))
  }, [account])

  useEffect(() => {
    getSynthBalance()
  }, [getSynthBalance])

  return (
    <div className="me">
      <div className="personal-title">
        <span>Personal information</span>
        <span>{t('person.title')}</span>
      </div>
      <div className="personal-content">
        <div className="synth-assets">
          <div>
            <span>xUSD</span>
            <span>{xUSD ?? <LoadingOutlined />}</span>
          </div>
          <div>
            <span>xEUR</span>
            <span>{xEUR ?? <LoadingOutlined />}</span>
          </div>
          <div>
            <span>xJPY</span>
            <span>{xJPY ?? <LoadingOutlined />}</span>
          </div>
          <div>
            <span>xAUD</span>
            <span>{xAUD ?? <LoadingOutlined />}</span>
          </div>
        </div>
        <div className="mortgage">
          <div>
            <span>{t('person.myRate')}</span>
            <span>
              {myRatio ? `${myRatio} %` : <LoadingOutlined />}
            </span>
          </div>
          <div>
            <span>{t('person.targetRate')}</span>
            <span>
              {targetRatio ? `${targetRatio} %` : <LoadingOutlined />}
            </span>
          </div>
        </div>
      </div>
      <div className="snk">
        <span>
          {t('person.dows')}
          {' '}
          DOWS
        </span>
        <span>
          {dows ? `${dows} DOWS` : <LoadingOutlined />}
        </span>
      </div>
      <div className="hr" />
      <div className="progressBar">
        <div className="progressBar-top">
          <span>
            {t('person.locked')}
            {': '}
            {lockedShadows ?? <LoadingOutlined />}
          </span>
          <span>
            {t('person.Transferable')}
            {': '}
            {transferableShadows ?? <LoadingOutlined />}
          </span>
        </div>
        <Progress
          percent={50}
          showInfo={false}
          strokeColor="#FF2C63"
          trailColor="#342D33"
          style={{
            position: 'relative',
            top: '20px',
          }}
        />
      </div>
      <div className="progressBar">
        <div className="progressBar-top">
          <span>Staked: 10000</span>
          <span>NotStaked: 0</span>
        </div>
        <Progress
          percent={50}
          showInfo={false}
          strokeColor="#FF2C63"
          trailColor="#342D33"
          style={{
            position: 'relative',
            top: '20px',
          }}
        />
      </div>
      <div className="progressBar">
        <div className="progressBar-top">
          <span>Staked: 0</span>
          <span>NotStaked: 0</span>
        </div>
        <Progress
          percent={50}
          showInfo={false}
          strokeColor="#FF2C63"
          trailColor="#342D33"
          style={{
            position: 'relative',
            top: '20px',
          }}
        />
      </div>
    </div>
  )
}

export default Personal
