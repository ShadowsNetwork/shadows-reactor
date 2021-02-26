import React, { useCallback, useEffect, useState } from 'react'
import '../../styles/personal.css'
import { Progress } from 'antd'
import { useTranslation } from 'react-i18next'
import { LoadingOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { fromWei, toByte32 } from '@/web3/utils'

function Personal() {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [xUSD, setXUSD] = useState(null)
  const [xJPY, setXJPY] = useState(null)
  const [xAUD, setXAUD] = useState(null)
  const [xEUR, setXEUR] = useState(null)
  const [dows, setDows] = useState(null)
  const [myRatio, setMyRatio] = useState(null)
  const [targetRatio, setTargetRatio] = useState(null)
  const [transferableDows, setTransferableDows] = useState(null)
  const [lockedShadows, setLockedShadows] = useState(null)

  const fetchDataFromContract = useCallback(async () => {
    const [xUSDBalance, xJPYBalance, xAUDBalance, xEURBalance,
      dowsBalance, collateralisationRatio, issuanceRatio,
      transferableShadows, debtBalance,
    ] = await Promise.all([
      dowsJSConnector.dowsJs.SynthxUSD.balanceOf(account),
      dowsJSConnector.dowsJs.SynthxJPY.balanceOf(account),
      dowsJSConnector.dowsJs.SynthxAUD.balanceOf(account),
      dowsJSConnector.dowsJs.SynthxEUR.balanceOf(account),

      dowsJSConnector.dowsJs.Shadows.balanceOf(account),
      dowsJSConnector.dowsJs.Shadows.collateralisationRatio(account),
      dowsJSConnector.dowsJs.ShadowsState.issuanceRatio(),

      dowsJSConnector.dowsJs.Shadows.transferableShadows(account),
      dowsJSConnector.dowsJs.Shadows.debtBalanceOf(account, toByte32('DOWS')),
    ])

    setXUSD(fromWei(xUSDBalance))
    setXJPY(fromWei(xJPYBalance))
    setXAUD(fromWei(xAUDBalance))
    setXEUR(fromWei(xEURBalance))
    setDows(fromWei(dowsBalance))
    setMyRatio(fromWei(collateralisationRatio))
    setTargetRatio(fromWei(issuanceRatio))
    setTransferableDows(fromWei(transferableShadows))
    setLockedShadows(fromWei(debtBalance.div(issuanceRatio)))
  }, [account])

  useEffect(() => {
    fetchDataFromContract()
  }, [fetchDataFromContract])

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
            {transferableDows ?? <LoadingOutlined />}
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
