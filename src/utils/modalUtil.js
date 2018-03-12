/**
 * Created by wuyunqiang on 2017/8/2.
 */
import React, { Component, PropTypes } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Dimensions,
    Image,
    Modal,
    TextInput,
    NativeModules,
    InteractionManager,
    StatusBar
} from 'react-native';
export default class ModalUtil extends Component {
    constructor(props) {
        super(props);
        this.state = { visible: this.props.visible };
    }
    componentWillReceiveProps(props) {
        this.setState({ visible: props.visible });
        if(props.visible){
            Platform.OS !== 'ios' ?   NativeModules.NativeUtil.showDialog() : null;
        }else{
            Platform.OS !== 'ios' ?   NativeModules.NativeUtil.StatusBar() : null;
        }
    }
    close=() => {
        requestAnimationFrame(() => {
            if (this.props.close) {
                // console.log("close","执行了父组件的close方法")
                this.props.close();
            } else {
                // console.log("close","执行本组件方法")
                this.setState({ visible: false });
                Platform.OS !== 'ios' ?  NativeModules.NativeUtil.StatusBar() : null;
            }
        });
    };
    componentWillMount() {}
    renderContent = () => (this.props.contentView());
    render() {
        return (
            <Modal
                animationType='none'// 进场动画 fade
                onRequestClose={() => this.close()}
                visible={this.state.visible}// 是否可见
                transparent
            >
                <TouchableOpacity
                    style={{flex: 1}}
                    activeOpacity={1}
                    onPress={this.close}
                >
                    <View style={[styles.container, this.props.customerlayout]}>
                        {this.renderContent()}
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
});