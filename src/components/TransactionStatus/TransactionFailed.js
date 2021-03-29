import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { CloseOutlined } from '@ant-design/icons';
import { withTranslation } from 'react-i18next';
import './index.less';
const TransactionFailed = ({ t, content, }) => {
    return (_jsxs(_Fragment, { children: [_jsx("div", Object.assign({ className: "transaction-failed" }, { children: _jsx(CloseOutlined, { style: {
                        fontSize: '2.4rem',
                        color: 'white',
                        marginTop: '0.9rem'
                    } }, void 0) }), void 0),
            _jsxs("div", Object.assign({ className: "text" }, { children: [_jsx("span", Object.assign({ className: "title" }, { children: t('transactionStatus.title.failed') }), void 0),
                    _jsx("span", Object.assign({ className: "content" }, { children: content }), void 0)] }), void 0)] }, void 0));
};
export default withTranslation()(TransactionFailed);
//# sourceMappingURL=TransactionFailed.js.map