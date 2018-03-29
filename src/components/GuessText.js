/**
 * Created by zhangzuohua on 2018/3/29.
 */

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    Linking,
    View,
    Dimensions,
    Animated,
    Easing,
    PanResponder,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    StatusBar,
    InteractionManager,
    BackHandler,
    ScrollView,
    TouchableWithoutFeedback,
    RefreshControl,
    DeviceEventEmitter,
    LayoutAnimation,
    NativeModules,
    ImageBackground,
    FlatList
} from 'react-native';
import PureModalUtil from "../utils/PureModalUtil";
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
export  default  class GuessText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAnswer : false,
        }
    }
    componentDidMount() {
    }
    render() {
        return (
            <View style={styles.Container}>
                <Text style={this.props.style} onPress={()=>{this.setState({showAnswer:true})}}>{this.props.children}</Text>
                {this.state.showAnswer ? <Text style={[this.props.style,{color:'black'},{marginLeft:10}]}>{this.props.item && this.props.item.miyu_answer}</Text> : null}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    Container : {
        flex:1,
        flexDirection:'row',
    }
})




