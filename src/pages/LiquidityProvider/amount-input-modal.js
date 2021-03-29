import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Button, message, Modal } from 'antd';
import LimitableNumberInput from '@/components/LimitableNumberInput';
import { numberWithCommas } from '@/utils';
import './amount-input-modal.less';
const AmountInputModal = ({ title, visible, maxAvailable, confirmCallback, cancelCallback }) => {
    const [inputValue, setInputValue] = useState('');
    useEffect(() => {
        if (visible) {
            setInputValue('');
        }
    }, [visible]);
    const handleConfirm = () => {
        if (new BigNumber(inputValue).lte(new BigNumber('0'))) {
            message.error('Value should gather than zero!');
            return;
        }
        console.log(inputValue, maxAvailable);
        if (new BigNumber(inputValue).gt(new BigNumber(maxAvailable))) {
            message.error('Insufficient balance!');
            return;
        }
        confirmCallback?.(inputValue);
    };
    return (_jsxs(Modal, Object.assign({ title: title, visible: visible, onCancel: cancelCallback, footer: null }, { children: [_jsxs("span", Object.assign({ className: "available" }, { children: [numberWithCommas(maxAvailable), " DOWS/ETH Available"] }), void 0),
            _jsxs("div", { children: [_jsx(LimitableNumberInput, { min: 0, max: maxAvailable, inputValue: inputValue, inputValueSetter: setInputValue, allowClear: true }, void 0),
                    _jsx("span", Object.assign({ className: "dows" }, { children: "DOWS" }), void 0),
                    _jsx(Button, Object.assign({ onClick: () => setInputValue(maxAvailable) }, { children: "MAX" }), void 0)] }, void 0),
            _jsxs("div", { children: [_jsx(Button, Object.assign({ onClick: cancelCallback }, { children: "Cancel" }), void 0),
                    _jsx(Button, Object.assign({ onClick: handleConfirm, disabled: inputValue.length === 0 }, { children: "Confirm" }), void 0)] }, void 0)] }), void 0));
};
export default AmountInputModal;
//# sourceMappingURL=amount-input-modal.js.map