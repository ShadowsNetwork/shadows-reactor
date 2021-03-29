import { jsx as _jsx } from "react/jsx-runtime";
import { Input } from 'antd';
import BigNumber from 'bignumber.js';
import assert from 'assert';
const LimitableNumberInput = prop => {
    const { min, max, inputValue, inputValueSetter, ...inputProps } = prop;
    if (typeof min === 'string') {
        assert(min.length === 0 || /\d+(.\d+)?/.test(min));
    }
    if (typeof max === 'string') {
        assert(max.length === 0 || /\d+(.\d+)?/.test(max));
    }
    const onKeyPress = (e) => {
        if (!/[.\d]/.test(e.key)) {
            e.preventDefault();
        }
    };
    const onChange = (e) => {
        if (!e.target.value) {
            inputValueSetter('');
            return;
        }
        if (max) {
            if (new BigNumber(e.target.value).lt(new BigNumber(max))) {
                inputValueSetter(e.target.value);
            }
            else {
                inputValueSetter(max.toString());
            }
        }
        if (min) {
            if (new BigNumber(e.target.value).gt(new BigNumber(min))) {
                inputValueSetter(e.target.value);
            }
            else {
                inputValueSetter(min.toString());
            }
        }
    };
    return (_jsx(Input, Object.assign({ value: inputValue, onKeyPress: onKeyPress, onChange: onChange }, inputProps), void 0));
};
export default LimitableNumberInput;
//# sourceMappingURL=index.js.map