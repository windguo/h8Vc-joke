/**
 * Created by zhangzuohua on 2018/1/22.
 */
const React = require('react');
const ReactNative = require('react-native');
const {
    TouchableOpacity,
    View,
} = ReactNative;

const Button = (props) => {
    return <TouchableOpacity {...props}>
        {props.children}
    </TouchableOpacity>;
};

module.exports = Button;