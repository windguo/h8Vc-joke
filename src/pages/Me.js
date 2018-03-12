/**
 * Created by zhangzuohua on 2018/3/6.
 */
/**
 * Created by zhangzuohua on 2018/1/19.
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
    FlatList,
    WebView,
    TextInput,
} from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import { ifIphoneX } from '../utils/iphoneX';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import urlConfig  from  '../../src/utils/urlConfig';
export  default  class Me extends Component {
    static navigationOptions = {
        tabBarLabel: '我的',
        tabBarIcon: ({tintColor,focused}) => (
            <IconSimple name="user" size={22} color={focused ? "red":'black'} />
        ),
        header: ({navigation}) => {
            return (
                <ImageBackground style={{...header}} source={require('../assets/backgroundImageHeader.png')} resizeMode='cover'>
                    <View style={{justifyContent: 'center', marginLeft: 10, alignItems: 'center', height: 43.7}}></View>
                    <Text style={{fontSize: 17, textAlign: 'center', lineHeight: 43.7, color: 'white', fontWeight:'100'}}>个人中心</Text>
                    <View style={{justifyContent: 'center', marginRight: 10, alignItems: 'center', height: 43.7}}></View>
                </ImageBackground>
            )
        }
    };
    constructor(props) {
        super(props);
    }
    componentDidMount() {}

    pushToWeb = (params) => {
        let url = '';
        if (params === 'yjfk'){
            url =   urlConfig.suggestURL;
        }else if(params === 'yhsyxy'){
         url =   urlConfig.agreementURL;
        }
        this.props.navigation.navigate('Web', {url:url});
    }
    render() {
        return (
           <View style={{flex:1,backgroundColor:'white'}}>
               <View style={{height:1,backgroundColor:'#F0F0F0'}}></View>
               <TouchableOpacity activeOpacity={1} onPress={()=>{this.pushToWeb('yjfk')}}>
                   <View style={{flexDirection:'row',alignItems:'center',height:50}}>
                       <MaterialIcons name="feedback" size={22} color={'black'} style={{marginLeft:20}}/>
                       <Text style={{marginLeft:10}}>意见反馈</Text>
                   </View>
               </TouchableOpacity>
               <View style={{height:1,backgroundColor:'#F0F0F0'}}></View>
               <TouchableOpacity activeOpacity={1} onPress={()=>{this.pushToWeb('yhsyxy')}}>
                   <View style={{flexDirection:'row',alignItems:'center',height:50}}>
                       <Feather name="file-text" size={22} color={'black'} style={{marginLeft:20}}/>
                       <Text style={{marginLeft:10}}>用户使用协议</Text>
                   </View>
               </TouchableOpacity>
               <View style={{height:1,backgroundColor:'#F0F0F0'}}></View>
           </View>
        );
    }

}
const header = {
    backgroundColor: '#C7272F',
    ...ifIphoneX({
        paddingTop: 44,
        height: 88
    }, {
        paddingTop: Platform.OS === "ios" ? 20 : SCALE(StatusBarHeight()),
        height:64,
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'flex-end'
}





