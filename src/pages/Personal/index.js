import React, { useCallback, useEffect, useState } from 'react'
import './index.css'
import { Progress } from 'antd'
import { useTranslation } from 'react-i18next'
import { LoadingOutlined } from '@ant-design/icons'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { bytesToString, fromWei } from '@/web3/utils'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'

function Personal() {
  const { t } = useTranslation()
  const account = useSelector(getAccount)

  const [dows, setDows] = useState(null)
  const [myRatio, setMyRatio] = useState(null)
  const [targetRatio, setTargetRatio] = useState(null)
  const [transferableDows, setTransferableDows] = useState(null)
  const [lockedShadows, setLockedShadows] = useState(null)
  const [currencyToBalanceList, setCurrencyToBalanceList] = useState([])

  const fetchRatio = useCallback(async () => {
    const [collateralisationRatio, issuanceRatio] = await Promise.all([
      dowsJSConnector.dowsJs.Shadows.collateralisationRatio(account),
      dowsJSConnector.dowsJs.ShadowsState.issuanceRatio(),
    ])

    setMyRatio(fromWei(collateralisationRatio))
    setTargetRatio(fromWei(issuanceRatio))
  }, [account])

  useEffect(() => {
    fetchRatio()
  }, [fetchRatio])

  const fetchDataFromContract = useCallback(async () => {
    const [dowsBalance, transferableShadows] = await Promise.all([
      dowsJSConnector.dowsJs.Shadows.balanceOf(account),
      dowsJSConnector.dowsJs.Shadows.transferableShadows(account),
    ])
    setDows(fromWei(dowsBalance))
    setTransferableDows(fromWei(transferableShadows))
    setLockedShadows(fromWei(dowsBalance.sub(transferableShadows)))
  }, [account])

  useEffect(() => {
    fetchDataFromContract()
  }, [fetchDataFromContract])

  const fetchAllCurrencyBalance = useCallback(async () => {
    if (account) {
      const availableCurrencies = (await dowsJSConnector.dowsJs.Shadows.availableCurrencyKeys()).map(k => bytesToString(k))
      const balanceList = await Promise.all(
        availableCurrencies.map(currency => dowsJSConnector.dowsJs.Synth[currency].balanceOf(account)),
      )
      const currencyToBalance = balanceList.map((balance, index) => ({
        currency: availableCurrencies[index],
        balance: fromWei(balance),
      }))
      currencyToBalance.sort((b, a) => a.balance - b.balance)
      setCurrencyToBalanceList(currencyToBalance.slice(0, 4))
    }
  }, [account])

  useEffect(() => {
    fetchAllCurrencyBalance()
  }, [fetchAllCurrencyBalance])

  return (
    <div className="me">
      <div className="personal-title">
        <span>Personal Information</span>
        <span>{t('person.title')}</span>
      </div>
      <div className="personal-content">
        {currencyToBalanceList.length === 0 ? (
          <div className="synth-assets-loading">
            <div>
              <LoadingOutlined />
            </div>
            <div>
              <LoadingOutlined />
            </div>
            <div>
              <LoadingOutlined />
            </div>
            <div>
              <LoadingOutlined />
            </div>
          </div>
        ) : (
          <div className="synth-assets">
            {currencyToBalanceList.map(({
              currency,
              balance,
            }) => (
              <div key={currency}>
                <span>{currency}</span>
                <span>{balance ?? <LoadingOutlined />}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mortgage">
          <div>
            <span>{t('person.myRate')}</span>
            <span>
              {myRatio && (parseFloat(myRatio) !== 0 ? `${Math.round(100 / myRatio)} %` : t('person.none'))}
              {!myRatio && <LoadingOutlined />}
            </span>
          </div>
          <div>
            <span>{t('person.targetRate')}</span>
            <span>
              {targetRatio ? `${Math.round(100 / targetRatio)} %` : <LoadingOutlined />}
            </span>
          </div>
        </div>
      </div>
      <div className="snk">
        <span>
          {t('person.totalDows')}
        </span>
        <span>
          {dows ?? <LoadingOutlined />}
        </span>
      </div>
      <div className="hr" />
      <div className="progressBar">
        <div className="progressBar-top">
          <span>
            {t('person.Transferable')}
            {': '}
            {transferableDows ?? <LoadingOutlined />}
          </span>
          <span>
            {t('person.locked')}
            {': '}
            {lockedShadows ?? <LoadingOutlined />}
          </span>
        </div>
        <Progress
          percent={dows ? ((transferableDows / dows) * 100) : 50}
          showInfo={false}
          strokeColor="#FF2C63"
          trailColor="#342D33"
          style={{
            position: 'relative',
            top: '20px',
          }}
        />
      </div>
      {/* <div className="progressBar">
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
      </div> */}
    </div>
  )
}

export default Personal
