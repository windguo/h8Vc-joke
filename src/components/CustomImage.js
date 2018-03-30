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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AutoHeightImage from 'react-native-auto-height-image';

export  default  class CustomImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAnswer : false,
            url:this.props.titlepic,
            height:200,
            showActivity:false,
            hiddActivity:false,
        }
        //组件卸载不要再改state
        this.lock = false;
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps){
        if (nextProps.titlepic !== this.props.titlepic || nextProps.pic_urls !== this.props.pic_urls){
         console.log('XXXXXXXXXXXXXXX','组件还活着接收数据了');
         this.setState({url:nextProps.titlepic,showActivity:false,hiddActivity:false});
        }
    }
    // shouldComponentUpdate(nextProps,nextState){
    //
    // }
    onLoadEnd = (params) => {
        if (this.state.url === this.props.titlepic){
            return ;
        }
        if(!this.lock) {
            this.setState({hiddActivity: true})
        }
    }
    changeUrl = () => {
        if(!this.lock) {
            this.setState({url: this.props.pic_urls});
            this.setState({showActivity: true});

        };
       // Image.getSize(this.props.pic_urls, (width, height) => {
            //  this.setState({height: (WIDTH - 40) * height / width});
          //  this.imageRef.setNativeProps({style:{width:WIDTH-40,height:(WIDTH - 40) * height / width}});
      //  });

    }
    componentWillUnmount() {
        console.log('组件死掉。。。。。','组件死掉死啦啦啦啦啦啦了');
        this.lock = true;
       // alert(123);
    }


    render() {
        return (
            <View style={[styles.Container,this.props.style]}>
                <AutoHeightImage source={{uri: this.state.url}} width={WIDTH-40}
                       onLoadEnd={this.onLoadEnd} ref={(e)=>{this.imageRef = e}} />
                {this.state.hiddActivity ? null :  <View style={styles.absoluteView}>
                    {this.state.showActivity ? <ActivityIndicator color={Color.redColor} size={'large'}/> : <TouchableOpacity activeOpacity={1} onPress={this.changeUrl}><MaterialIcons name="play-circle-outline" size={40} color='#f60'/></TouchableOpacity>}
                </View>}
            </View>

        );
    }
}
const styles = StyleSheet.create({
    Container : {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    absoluteView : {
        position:'absolute',
        alignItems:'center',
        justifyContent:'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
})




