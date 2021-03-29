import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import TransactionInProgress from './TransactionInProgress';
import TransactionCompleted from './TransactionCompleted';
import TransactionFailed from './TransactionFailed';
import { Button } from 'antd';
import { withTranslation } from 'react-i18next';
const TransactionStatus = ({ t, content, hash, error, success, inProgress, closed, onClosed }) => {
    const props = {
        content,
        hash,
        error,
        success,
        inProgress,
        closed,
        onClosed
    };
    return !closed && (inProgress || success || error) ? (_jsxs("div", Object.assign({ className: "transaction-status" }, { children: [inProgress && _jsx(TransactionInProgress, Object.assign({}, props), void 0),
            success && _jsx(TransactionCompleted, Object.assign({}, props), void 0),
            error && _jsx(TransactionFailed, Object.assign({}, props), void 0),
            _jsxs("div", Object.assign({ className: "transaction-btn-group" }, { children: [_jsx(Button, Object.assign({ className: "view-btn", onClick: () => {
                            window.open(`https://kovan.etherscan.io/tx/${hash}`);
                        } }, { children: t('transactionStatus.button.view') }), void 0),
                    _jsx(Button, Object.assign({ className: "close-btn", onClick: () => onClosed() }, { children: t('transactionStatus.button.close') }), void 0)] }), void 0)] }), void 0)) : (_jsx(_Fragment, {}, void 0));
};
export default withTranslation()(TransactionStatus);
//# sourceMappingURL=index.js.map