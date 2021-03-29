import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAccount } from '@/store/wallet';
import './index.less';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector';
import { fromWei, toWei } from '@/web3/utils';
import BigNumber from 'bignumber.js';
import uniswap from '@/img/liquidityProvider/uniswap.png';
import eth from '@/img/liquidityProvider/eth.png';
import AmountInputModal from './amount-input-modal';
import useDowsPriceQuery from '@/queries/useDowsPriceQuery';
import { numberWithCommas } from '@/utils';
async function getCurrentAPR() {
    const lp_to_dows = new BigNumber('33.22443529339985');
    const totalSupply = new BigNumber(fromWei(await dowsJSConnector.dowsJs.LpERC20Token.totalSupply()));
    const totalDows = lp_to_dows.multipliedBy(totalSupply);
    return `${new BigNumber('4.5e6').dividedBy(totalDows)
        .multipliedBy('1e2')
        .toFixed(2)} %`;
}
const LiquidityProvider = () => {
    const account = useSelector(getAccount);
    const [modal, setModal] = useState({
        visible: false,
        title: '',
        confirmCallback: undefined,
        maxAvailable: ''
    });
    const dowsPrice = new BigNumber(useDowsPriceQuery().data);
    const [lpBalance, setLpBalance] = useState('');
    const [lpBalanceInUSD, setLpBalanceInUSD] = useState('');
    const [currentAPR, setCurrentAPR] = useState('');
    const [userLockedLp, setUserLockedLp] = useState('');
    const [userLockedLpInUSD, setUserLockedLpInUSD] = useState('');
    const [dowsEarned, setDowsEarned] = useState('');
    const fetchData = useCallback(async () => {
        if (!account) {
            return;
        }
        const [balance, deposited, pending, currentAPR] = await Promise.all([
            dowsJSConnector.dowsJs.LpERC20Token.balanceOf(account),
            dowsJSConnector.dowsJs.Farm.deposited(0, account),
            dowsJSConnector.dowsJs.Farm.pending(0, account),
            getCurrentAPR()
        ]);
        setLpBalance(fromWei(balance));
        setLpBalanceInUSD(new BigNumber(lpBalance).multipliedBy(dowsPrice)
            .toFixed(2));
        setUserLockedLp(fromWei(deposited));
        setUserLockedLpInUSD(new BigNumber(userLockedLp).multipliedBy(dowsPrice)
            .toFixed(2));
        setDowsEarned(new BigNumber(fromWei(pending)).toFixed(2));
        setCurrentAPR(currentAPR);
    }, [account, dowsPrice]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const lock = async (amount) => {
        const lpBalance = await dowsJSConnector.dowsJs.LpERC20Token.balanceOf(account);
        const amountInWei = toWei(amount);
        console.log(lpBalance, amountInWei);
        if (new BigNumber(amountInWei).gt(new BigNumber(lpBalance))) {
            message.error('Insufficient balance.');
            return;
        }
        const { contractAddress } = dowsJSConnector.dowsJs.Farm;
        try {
            const approveResult = await dowsJSConnector.dowsJs.LpERC20Token.approve(contractAddress, amount);
            console.log(approveResult);
            const confirmation = await approveResult.wait();
            console.log(confirmation);
            const depositResult = await dowsJSConnector.dowsJs.Farm.deposit(0, lpBalance);
            console.log(depositResult);
        }
        catch (e) {
            console.error(e);
        }
    };
    const unlock = async (amount) => {
        const amountInWei = toWei(amount);
        dowsJSConnector.dowsJs.Farm
            .withdraw(0, amountInWei)
            .then((r) => {
            console.log(r);
        })
            .catch((e) => {
            console.error(e);
        });
    };
    const claim = async () => {
        try {
            const withdrawResult = await dowsJSConnector.dowsJs.Farm.withdraw(0, 0);
            console.log(withdrawResult);
            const confirmation = await withdrawResult.wait();
            console.log(confirmation);
        }
        catch (error) {
            console.error(error);
        }
    };
    const cancelCallback = () => {
        setModal({
            ...modal,
            visible: false
        });
    };
    return (_jsxs("div", Object.assign({ className: "liquidity" }, { children: [_jsxs("div", Object.assign({ className: "uniswap" }, { children: [_jsx("img", { src: uniswap, alt: "" }, void 0),
                    _jsx("span", { children: "Uniswap" }, void 0)] }), void 0),
            _jsxs("div", Object.assign({ className: "info" }, { children: [_jsx("div", Object.assign({ className: "info-container-title" }, { children: "DOWS/ETH" }), void 0),
                    _jsx("img", { src: eth }, void 0),
                    _jsxs("div", Object.assign({ className: "info-container" }, { children: [_jsxs("div", Object.assign({ className: "item" }, { children: [_jsx("div", Object.assign({ className: "title" }, { children: "LP Tokens to Lock" }), void 0),
                                    _jsx("div", Object.assign({ className: "value" }, { children: numberWithCommas(lpBalance) }), void 0),
                                    _jsxs("div", Object.assign({ className: "additional" }, { children: ["$", numberWithCommas(lpBalanceInUSD)] }), void 0)] }), void 0),
                            _jsxs("div", Object.assign({ className: "item" }, { children: [_jsx("div", Object.assign({ className: "title" }, { children: "Current APR" }), void 0),
                                    _jsx("div", Object.assign({ className: "value" }, { children: currentAPR }), void 0)] }), void 0),
                            _jsxs("div", Object.assign({ className: "item" }, { children: [_jsx("div", Object.assign({ className: "title" }, { children: "Your LP Locked" }), void 0),
                                    _jsx("div", Object.assign({ className: "value" }, { children: numberWithCommas(userLockedLp) }), void 0),
                                    _jsxs("div", Object.assign({ className: "additional" }, { children: ["$", numberWithCommas(userLockedLpInUSD)] }), void 0)] }), void 0),
                            _jsxs("div", Object.assign({ className: "item" }, { children: [_jsx("div", Object.assign({ className: "title" }, { children: "DOWS Earned" }), void 0),
                                    _jsx("div", Object.assign({ className: "value" }, { children: dowsEarned }), void 0)] }), void 0)] }), void 0),
                    _jsxs("div", Object.assign({ className: "button-container" }, { children: [_jsx(Button, Object.assign({ onClick: () => {
                                    setModal({
                                        ...modal,
                                        maxAvailable: lpBalance,
                                        visible: true,
                                        title: 'Stake Liquidity',
                                        cancelCallback,
                                        confirmCallback: lock
                                    });
                                } }, { children: _jsx(PlusOutlined, {}, void 0) }), void 0),
                            _jsx(Button, Object.assign({ onClick: () => {
                                    setModal({
                                        ...modal,
                                        maxAvailable: userLockedLp,
                                        visible: true,
                                        title: 'Unstake Liquidity',
                                        cancelCallback,
                                        confirmCallback: unlock
                                    });
                                } }, { children: "Unlock" }), void 0),
                            _jsx(Button, Object.assign({ onClick: claim }, { children: "Redeem" }), void 0)] }), void 0)] }), void 0),
            _jsx(AmountInputModal, Object.assign({}, modal), void 0)] }), void 0));
};
export default LiquidityProvider;
//# sourceMappingURL=index.js.map