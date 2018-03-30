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
import { ifIphoneX } from '../../utils/iphoneX';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import urlConfig  from  '../../utils/urlConfig';
import PureModalUtil from '../../utils/PureModalUtil';
import * as WeChat from 'react-native-wechat';
import storageKeys from '../../utils/storageKeyValue'
import ScrollTabView from "../ScrollTabView";
export  default  class Me extends Component {
    static navigationOptions = {
        tabBarLabel: '我的',
        tabBarIcon: ({tintColor,focused}) => (
            <IconSimple name="user" size={22} color={focused ? "red":'black'} />
        ),
        header: ({navigation}) => {
            return (
                <ImageBackground style={{...header}} source={require('../../assets/backgroundImageHeader.png')} resizeMode='cover'>
                    <View style={{justifyContent: 'center', marginLeft: 10, alignItems: 'center', height: 43.7}}></View>
                    <Text style={{fontSize: 16, textAlign: 'center', lineHeight: 43.7, color: 'white', fontWeight:'100'}}>个人中心</Text>
                    <View style={{justifyContent: 'center', marginRight: 10, alignItems: 'center', height: 43.7}}></View>
                </ImageBackground>
            )
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            ViewHeight:new Animated.Value(0),
            username:'',
            userpwd:'',
            userName:null,
        };
    }
    componentWillMount() {
        this._ViewHeight = new Animated.Value(0);
    }
    componentWillUnmount() {
        this.subscription.remove();
    }
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('LoginSuccess', this.LoginSuccess);
        setTimeout( ()=> {GLOBAL.userInfo &&  this.setState({username:GLOBAL.userInfo.username})},500);
       // GLOBAL.userInfo &&  this.setState({username:GLOBAL.userInfo.username});
       // alert(JSON.stringify(GLOBAL.userInfo));
    }
    LoginSuccess = () => {
        this.setState({username:GLOBAL.userInfo.username});
    }
    pushToWeb = (params) => {
        let url = '';
        if (params === 'yjfk'){
            url =   urlConfig.suggestURL;
        }else if(params === 'yhsyxy'){
         url =   urlConfig.agreementURL;
        }
        this.props.navigation.navigate('Web', {url:url});
    }
    pushToAppStore = ()=> {
        var url = Platform.OS === 'ios' ? 'https://itunes.apple.com/cn/app/哈吧-海量精品段子大全/id1353739043?mt=8' : 'https://www.pgyer.com/h8vc';
        Linking.openURL(url)
            .catch((err)=>{
                console.log('An error occurred', err);
            });
    }
    clickToShare = (type) => {
        this.close();
        WeChat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                if (type === 'Session') {
                    WeChat.shareToSession({
                        title: "【哈吧笑话分享】",
                        description: '海量搞笑段子、网名、签名、句子分享平台，有什么理由不来开心？',
                        type: 'news',
                        webpageUrl: Platform.OS === 'ios' ? 'https://itunes.apple.com/cn/app/哈吧-海量精品段子大全/id1353739043?mt=8' : 'https://www.pgyer.com/h8vc',
                        thumbImage: urlConfig.thumbImage,
                    }).then((message)=>{message.errCode === 0  ? this.ToastShow('分享成功') : this.ToastShow('分享失败')}).catch((e)=>{if (error.message != -2) {
                        Toast.show(error.message);
                    }});
                } else {
                    WeChat.shareToTimeline({
                        title: "海量搞笑段子、网名、签名、句子分享平台，有什么理由不来开心？",
                        description: "海量搞笑段子、网名、签名、句子分享平台，有什么理由不来开心？",
                        type: 'news',
                        webpageUrl: Platform.OS === 'ios' ? 'https://itunes.apple.com/cn/app/哈吧-海量精品段子大全/id1353739043?mt=8' : 'https://www.pgyer.com/h8vc' ,
                        thumbImage: urlConfig.thumbImage,
                    }).then((message)=>{message.errCode === 0  ? this.ToastShow('分享成功') : this.ToastShow('分享失败')}).catch((error) => {
                        if (error.message != -2) {
                            Toast.show(error.message);
                        }
                    });
                }
            } else {
                //Toast.show("没有安装微信软件，请您安装微信之后再试");
            }
        });
    }
    renderSpinner = (text) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {this.setState({visible: false});}}>
                <View key="spinner" style={styles.spinner}>
                    <Animated.View style={{  justifyContent: 'center',
                        width:WIDTH,
                        height: this._ViewHeight,
                        backgroundColor: '#fcfcfc',
                        position:'absolute',
                        left:0,
                        right:0,
                        bottom:0,
                        overflow:'hidden'}}>
                        <View style={styles.shareParent}>
                            <TouchableOpacity
                                style={styles.base}
                                onPress={()=>this.clickToShare('Session')}
                            >
                                <View style={styles.shareContent}>
                                    <Image style={styles.shareIcon} source={require('../../assets/share_icon_wechat.png')} />
                                    <Text style={styles.spinnerTitle}>微信好友</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.base}
                                onPress={()=>this.clickToShare('TimeLine')}
                            >
                                <View style={styles.shareContent}>
                                    <Image style={styles.shareIcon} source={require('../../assets/share_icon_moments.png')} />
                                    <Text style={styles.spinnerTitle}>微信朋友圈</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{height:10,backgroundColor:'#f5f5f5'}}></View>
                        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                            <Text style={{ fontSize: 16, color: 'black',textAlign: 'center' }}>取消</Text>
                        </View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        );
    };
    show = ()=>{
        this._ViewHeight.setValue(0);
        this.setState({
            visible:true
        },  Animated.timing(this._ViewHeight, {
            fromValue:0,
            toValue: 140, // 目标值
            duration: 200, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start());
    };
    close = ()=>{
        this.setState({
            visible:false
        });
    };
    callBack = (username) => {
        this.setState({username:username});
    }
    clickToLogin = () => {
        if (this.state.username){
            return ;
        }
        this.props.navigation.navigate('Login', {callBack:this.callBack});
    }
    clickToPublish = ()=>{
        if (!this.state.username){
            alert('请登录');
            return ;
        }
        this.props.navigation.navigate('Publish');
    }
    clickToCollection = () =>{
        if (!this.state.username) {
            alert('请登录');
            return;
        }
        this.props.navigation.navigate('Collection');
    }
    quit = () => {
        REMOVE_ITEM(storageKeys.userInfo);
        this.setState({username:null});
        global.userInfo = null;
    }
    render() {
        return (
           <ScrollView style={{flex:1,backgroundColor:Color.f5f5f5}}>
               <View style={{width:WIDTH,height:10,backgroundColor:Color.f5f5f5}}/>
               <View style={{height:1,backgroundColor:Color.f5f5f5}}></View>
               <TouchableOpacity activeOpacity={1} onPress={this.clickToLogin}>
                   <View style={{flexDirection:'row',alignItems:'center',height:50,backgroundColor:'white',justifyContent:'space-between'}}>
                       <View style={{marginLeft:20,flexDirection:'row',alignItems:'center'}}>
                           <IconSimple name="user" size={22} color={Color.FontColor} />
                            <Text style={{ marginLeft: 10 }}>{this.state.username ? '欢迎您,' + this.state.username : '立即登录哈吧'}</Text>
                       </View>
                        <IconSimple name="arrow-right" size={18} color={Color.FontColor} style={{ marginRight: 20 }} />
                   </View>
               </TouchableOpacity>
               <View style={{height:1,backgroundColor:Color.f5f5f5}}></View>
               {this.state.username ?
               <View>
                        <TouchableOpacity activeOpacity={1} onPress={this.clickToPublish}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: 'white', justifyContent: 'space-between' }}>
                            <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                                <IconSimple name="wallet" size={22} color={Color.FontColor} />
                                <Text style={{ marginLeft: 10 }}>我发布的内容</Text>
                            </View>
                            <IconSimple name="arrow-right" size={18} color={Color.FontColor} style={{ marginRight: 20 }} />
                        </View>
                    </TouchableOpacity>
                    <View style={{ height: 1, backgroundColor: Color.f5f5f5 }}></View>
                    <TouchableOpacity activeOpacity={1} onPress={this.clickToCollection}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: 'white', justifyContent: 'space-between' }}>
                        <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <IconSimple name="wallet" size={22} color={Color.FontColor} />
                            <Text style={{ marginLeft: 10 }}>我收藏的内容</Text>
                        </View>
                        <IconSimple name="arrow-right" size={18} color={Color.FontColor} style={{ marginRight: 20 }} />
                    </View>
                </TouchableOpacity>
               </View> : <View/>}
               <View style={{width:WIDTH,height:10,backgroundColor:Color.f5f5f5}}/>
               <TouchableOpacity activeOpacity={1} onPress={()=>{this.pushToWeb('yjfk')}}>
                   <View style={{flexDirection:'row',alignItems:'center',height:50,backgroundColor:'white',justifyContent:'space-between'}}>
                       <View style={{marginLeft:20,flexDirection:'row',alignItems:'center'}}>
                           <IconSimple name="question" size={22} color={Color.FontColor} />
                           <Text style={{marginLeft:10}}>意见反馈</Text>
                       </View>
                       <IconSimple name="arrow-right" size={18} color={Color.FontColor} style={{marginRight:20}}/>
                   </View>
               </TouchableOpacity>
               <View style={{height:1,backgroundColor:Color.f5f5f5}}></View>
               <TouchableOpacity activeOpacity={1} onPress={()=>{this.pushToWeb('yhsyxy')}}>
                   <View style={{flexDirection:'row',alignItems:'center',height:50,backgroundColor:'white',justifyContent:'space-between'}}>
                       <View style={{marginLeft:20,flexDirection:'row',alignItems:'center'}}>
                           <IconSimple name="doc" size={22} color={Color.FontColor} />
                           <Text style={{marginLeft:10}}>用户使用协议</Text>
                       </View>
                       <IconSimple name="arrow-right" size={18} color={Color.FontColor} style={{marginRight:20}}/>
                   </View>
               </TouchableOpacity>
               <View style={{height:1,backgroundColor:Color.f5f5f5}}></View>
               <View style={{width:WIDTH,height:10,backgroundColor:Color.f5f5f5}}/>
               <View style={{height:1,backgroundColor:Color.f5f5f5}}></View>
               <TouchableOpacity activeOpacity={1} onPress={this.pushToAppStore}>
                   <View style={{flexDirection:'row',alignItems:'center',height:50,backgroundColor:'white',justifyContent:'space-between'}}>
                       <View style={{marginLeft:20,flexDirection:'row',alignItems:'center'}}>
                           <IconSimple name="like" size={22} color={Color.FontColor} />
                           <Text style={{marginLeft:10}}>喜欢我们,打分鼓励</Text>
                       </View>
                       <IconSimple name="arrow-right" size={18} color={Color.FontColor} style={{marginRight:20}}/>
                   </View>
               </TouchableOpacity>
               <View style={{height:1,backgroundColor:Color.f5f5f5}}></View>
               <TouchableOpacity activeOpacity={1} onPress={this.show}>
                   <View style={{flexDirection:'row',alignItems:'center',height:50,backgroundColor:'white',justifyContent:'space-between'}}>
                       <View style={{marginLeft:20,flexDirection:'row',alignItems:'center'}}>
                           <IconSimple name="share" size={22} color={Color.FontColor} />
                           <Text style={{marginLeft:10}}>分享给朋友</Text>
                       </View>
                       <IconSimple name="arrow-right" size={18} color={Color.FontColor} style={{marginRight:20}}/>
                   </View>
               </TouchableOpacity>
               <View style={{width:WIDTH,height:10,backgroundColor:Color.f5f5f5}}/>
               {this.state.username ?
               <TouchableOpacity activeOpacity={1} onPress={this.quit}>
                   <View style={{flexDirection:'row',alignItems:'center',height:50,backgroundColor:'white',justifyContent:'space-between'}}>
                       <View style={{marginLeft:20,flexDirection:'row',alignItems:'center'}}>
                           <IconSimple name="logout" size={22} color={Color.FontColor} />
                           <Text style={{marginLeft:10}}>退出登录</Text>
                       </View>
                       <IconSimple name="arrow-right" size={18} color={Color.FontColor} style={{marginRight:20}}/>
                   </View>
               </TouchableOpacity> : <View/>}
               <PureModalUtil
                   visible = {this.state.visible}
                   close = {this.close}
                   contentView = {this.renderSpinner}/>
           </ScrollView>
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
const styles = StyleSheet.create({
    base: {
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFF'
    },
    spinner: {
        width: WIDTH,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)'
    },
    spinnerContent: {
        justifyContent: 'center',
        width: WIDTH,
        backgroundColor: '#fcfcfc',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    spinnerTitle: {
        fontSize: 14,
        color: '#313131',
        textAlign: 'center',
        marginTop: 5
    },
    shareParent: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },
    shareContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shareIcon: {
        width: 40,
        height: 40
    },
});





