import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { LoadingOutlined } from '@ant-design/icons';
import { withTranslation } from 'react-i18next';
import './index.less';
const TransactionInProgress = ({ t, content, }) => {
    return (_jsxs(_Fragment, { children: [_jsx(LoadingOutlined, { style: {
                    fontSize: '4.5rem',
                    color: 'white',
                    marginLeft: '2rem'
                } }, void 0),
            _jsxs("div", Object.assign({ className: "text" }, { children: [_jsx("span", Object.assign({ className: "title" }, { children: t('transactionStatus.title.inProgress') }), void 0),
                    _jsx("span", Object.assign({ className: "content" }, { children: content }), void 0)] }), void 0)] }, void 0));
};
export default withTranslation()(TransactionInProgress);
//# sourceMappingURL=TransactionInProgress.js.map