/**
 * Created by zhangzuohua on 2018/1/22.
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
    AppState,
    NetInfo,
    Modal
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import LoadingSpinner from '../components/pull/LoadingSpinner';
import Button from '../components/Button';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import {ifIphoneX} from '../utils/iphoneX';
import Home from './Home';
import codePush from 'react-native-code-push'
import SplashScreen from 'react-native-splash-screen'
import * as WeChat from 'react-native-wechat';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import urlConfig  from  '../../src/utils/urlConfig';
import storageKeys from '../utils/storageKeyValue';
var DeviceInfo = require('react-native-device-info');
import JPushModule from 'jpush-react-native';
import HttpUtil from  '../utils/HttpUtil';
const NativeVersion = DeviceInfo.getVersion();
export  default  class ScrollTabView extends Component {
    static navigationOptions = {
        tabBarLabel: '最新',
        tabBarIcon: ({tintColor,focused}) => (
            <IconSimple name="fire" size={22} color={focused ? "red":'black'} />
        ),
        header: ({navigation}) => {
            return (
                <ImageBackground style={{...header}} source={require('../assets/backgroundImageHeader.png')} resizeMode='cover'>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.state.routes[0].routes[0].params.leftFuc && navigation.state.routes[0].routes[0].params.leftFuc();
                    }}>
                        <View style={{justifyContent: 'center', marginLeft: 10, alignItems: 'center', height: 43.7}}>
                            <MaterialIcons name="search" size={25} color='white'/>
                        </View>
                    </TouchableOpacity>
                    <Text style={{fontSize: 17, textAlign: 'center', lineHeight: 43.7, color: 'white', fontWeight:'100'}}>哈吧</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.state.routes[0].routes[0].params.rightFuc && navigation.state.routes[0].routes[0].params.rightFuc();
                    }}>
                        <View style={{justifyContent: 'center', marginRight: 10, alignItems: 'center', height: 43.7}}>
                            <MaterialIcons name="add" size={35} color='white'/>
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
            )
        }
    };
    //88  43.7 fontSize 17 fontWeight:600 RGBA0009 textALi;center
    constructor(props) {
        super(props);
        this.state = {
            sectionList: [],
            page: 0,
            renderLoading:false,
            renderError:false,
            showModal:false,
        };

    }
    readUserCache = () => {
        READ_CACHE(storageKeys.userInfo, (res) => {
            if (res && res.userid) {
                GLOBAL.userInfo = res
                console.log('userInfo',res);
            } else {
                console.log('获取用户信息失败');
            }
        }, (err) => {
            console.log('获取用户信息失败');
        });

    }
    CodePushSync = () => {
        codePush.sync(
            {
                installMode: codePush.InstallMode.ON_NEXT_RESTART,
                // updateDialog: {
                //     appendReleaseDescription: true,
                //     descriptionPrefix: '更新内容:',
                //     mandatoryContinueButtonLabel: '更新',
                //     mandatoryUpdateMessage: '有新版本了，请您及时更新',
                //     optionalInstallButtonLabel: '立即更新',
                //     optionalIgnoreButtonLabel: '稍后',
                //     optionalUpdateMessage: '有新版本了，是否更新?',
                //     title: '提示'
                // },
            },
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        );
    }
    componentWillMount() {
        this.updateConfig = {
            ios:{isForce:false,downloadUrl:''},
            android:{isForce:false,downloadUrl:''},
            message:''
        },
        //监听状态改变事件
        AppState.addEventListener('change', this.handleAppStateChange);
        NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);

    }
    componentDidMount() {
        this.InitJPush();
        this.readUserCache();
        if (Platform.OS === 'android'){
            NativeModules.NativeUtil.StatusBar();
        }
        SplashScreen.hide();
        this.CodePushSync();
        WeChat.registerApp('wxd750cac4fb66b983');
        this.props.navigation.setParams({
            rightFuc: () => {
                let url = '';
                if (global.activeClassId === '0' || global.activeClassId === '1'){
                    url = urlConfig.pubLishUrl;
                }else{
                    url = urlConfig.pubLishUrl + '/?classid=' + global.activeClassId;
                }
                if (global.userInfo){
                    this.props.navigation.navigate('Web',{url:url});
                }else{
                    this.props.navigation.navigate('Login');
                }
            },
            leftFuc: () => {
                this.props.navigation.navigate('SearchTag');
                // DeviceEventEmitter.emit('reloadData')
            }
        });
        InteractionManager.runAfterInteractions(() => {
            this.loadData();
            this.checkAppUpdateMessage();
            this.setState({renderLoading:true});
        });


    }

    //这里执行要跳转的页面
    jumpToOther = ()=>{
        console.log('JPushModule jump to SecondActivity')
       //  this.props.navigation.navigate('Test')
    }

    InitJPush=()=>{
        if (Platform.OS === 'android') {
            JPushModule.initPush();
            JPushModule.getInfo(map => {
                this.setState({
                    appkey: map.myAppKey,
                    imei: map.myImei,
                    package: map.myPackageName,
                    deviceId: map.myDeviceId,
                    version: map.myVersion
                })
            })
            JPushModule.notifyJSDidLoad(resultCode => {
                if (resultCode === 0) {
                }
            })
        }

        if (Platform.OS === 'ios') {
            JPushModule.setupPush();
            JPushModule.setBadge(0, success => {})
        }

        // JPushModule.addReceiveCustomMsgListener(map => {
        //     console.log('JPushModule CustomMsgextras: ' + map.extras)
        //     console.log('JPushModule CustomMsg',map.toString());
        // })

        // JPushModule.addReceiveNotificationListener(map => {
        //     console.log('JPushModule Notification alertContent: ' + map.alertContent)
        //     console.log('JPushModule Notification extras: ' + map.extras)
        //    /// var extra = JSON.parse(map.extras);
        //     console.log("JPushModule Notification",extra.key + ": " + extra.value);
        // })

        //点击回调这个函数
        // JPushModule.addReceiveOpenNotificationListener(map => {
        //     console.log('JPushModule Openingnotification!')
        //     console.log('JPushModule map.extra: ' + map.extras)
        //     this.jumpToOther()
        //     // JPushModule.jumpToPushActivity("SecondActivity");
        // })

        // JPushModule.addGetRegistrationIdListener(registrationId => {
        //     console.log('JPushModule Device register succeed, registrationId ' + registrationId)
        // })
    }

    componentWillUnmount() {
        //删除状态改变事件监听
        AppState.removeEventListener('change');
        NetInfo.removeEventListener('connectionChange');
        // JPushModule.removeReceiveCustomMsgListener();
        // JPushModule.removeReceiveNotificationListener();
        // JPushModule.clearAllNotifications()

    }
    handleAppStateChange = (appState) => {
        console.log('当前状态为:' + appState);
        if (appState === 'active') {
            this.CodePushSync && this.CodePushSync();

        }
    }
    handleConnectivityChange = (status) =>{
        console.log('status change:' , status);
        if (status.type !== 'none'){
            this.loadData();
            this.setState({renderLoading:true});
        }
    }
    codePushDownloadDidProgress(progress) {

    }
    codePushStatusDidChange(syncStatus) {
        switch (syncStatus) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                console.log("Checking for update.");
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.log("Downloading package.");
                break;
            case codePush.SyncStatus.AWAITING_USER_ACTION:
                console.log('wait for user');
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                console.log('Installing update.');
                break;
            case codePush.SyncStatus.UP_TO_DATE:
                console.log("App up to date.");
                break;
            case codePush.SyncStatus.UPDATE_IGNORED:
                console.log("Update cancelled by user.");
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                console.log('installed');
                break;
            case codePush.SyncStatus.UNKNOWN_ERROR:
                console.log('unknow error');
                break;
        }
    }
   clickDownload = ()=> {
        let url = '';
        if (Platform.OS === 'ios'){
            url = this.updateConfig.ios.downloadUrl;
            // if (!this.updateConfig.ios.flag){
            //     this.setState({showModal:false});
            // }
        }else{
            url = this.updateConfig.android.downloadUrl;
            // if (!this.updateConfig.android.flag){
            //     this.setState({showModal:false});
            // }
        }
       Linking.openURL(url)
           .catch((err)=>{
               console.log('An error occurred', err);
           });
   }
   clickToCancelModal = () => {
        this.setState({showModal:false})
   }
    compareVersionNumber = (ServerPram,LocalPram) => {
        let v1g = ServerPram.split(".");
        let v2g = LocalPram.split(".");
        let flag = false;
        for (var i=0;i<3;i++) {
            if (parseInt(v1g[i]) > parseInt(v2g[i]))  {
                flag = true;
                break;
            }
        }
        return flag;
    }
    checkAppUpdateMessage = async() => {
        let url = urlConfig.CheckUpdate;
        let res =  await  HttpUtil.GET(url);
        if(!res||!res.result){
            return;
        }
        let result = res.result ? res.result:[];
        try {
            let [message, android, ios] = result;
            console.log('xxxxx',message,android,ios);
            if (Platform.OS === 'android') {
                let compRes = this.compareVersionNumber(android.android, NativeVersion);
                this.updateConfig.android = android;
                this.updateConfig.message = message.updateInfo;
                if (compRes){
                    this.setState({showModal:true});
                }
            } else if (Platform.OS === 'ios') {
                let compRes = this.compareVersionNumber(ios.ios, NativeVersion);
                this.updateConfig.ios = ios;
                this.updateConfig.message = message.updateInfo;
                if (compRes){
                    this.setState({showModal:true});
                }
            } else {
            }
        }catch (err){}
    }

    loadData = async()=>{
    let url = urlConfig.sectionList;
    console.log('sectionList',url);
    let res = await HttpUtil.GET(url);
    if(!res||!res.result){
        this.setState({renderLoading:false});
        this.setState({renderError:true});
        READ_CACHE(storageKeys.sectionList, (res) => {
            if (res && res.length > 0) {
                this.setState({sectionList: res});
            } else {
            }
        }, (err) => {
        });
        return;
    }
    this.setState({renderLoading:false});
    this.setState({renderError:false});
    let result = res.result ? res.result:[];
    WRITE_CACHE(storageKeys.sectionList, result);
    this.setState({sectionList: result});
    console.log('res', res);
};
        renderTab = (tabs) => {
            let array = [];
            array.push(tabs.map((item) => {
                return <Text style={{width: 50, height: 20}}>{item}</Text>
            }));
            return array;
        }
        renderTabBar = (params) => {
            global.activeTab = params.activeTab;
            this.state.sectionList.forEach((v, i) => {
                if (i === params.activeTab) {
                    global.activeClassId = v.classid
                }
            })

            return <ScrollableTabBar activeTextColor='red' underlineStyle={{height: 0,width:0}}
                                     backgroundColor='white' textStyle={{fontSize: 16, fontWeight:'100'}}
                                     tabStyle={{paddingLeft: 10, paddingRight: 10}} />;
        }
        pageNumber = (number) => {
            let page = 0;
            this.state.sectionList.forEach((v, i) => {
                if (parseInt(v.classid) === number) {
                    page = i
                }
            })
            this.setState({page: page});
        }
        renderContent = (sectionList) => {
            let list = [];
            list.push(sectionList.map((data, index) => {
                return <Home tabLabel={data.classname} data={data} {...this.props} pageNumber={(number) => {
                    this.pageNumber(number)
                }} index={index}/>
            }));
            return list;
        }
    _renderError = (params)=>{
        return (
            <View style={[styles.contain,{justifyContent:'center',alignItems:'center'}]}>
                {Platform.OS === 'ios' ? <StatusBar barStyle="light-content"/> : null}
                <TouchableOpacity onPress={()=>this.loadData()}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Image style={{width:SCALE(323),height:SCALE(271)}} source={require('../assets/nonetwork.png')}/>
                        <Text style={{fontSize:FONT(15),color:Color.C666666}}>{params ? params : '网络无法连接，点击屏幕重试'}</Text>
                    </View>
                </TouchableOpacity>
            </View>)
    };
    _renderLoading = ()=> {
        return (<View style={styles.contain}>
            {Platform.OS === 'ios' ? <StatusBar barStyle="light-content"/> : null}
            <LoadingSpinner type="normal"/></View>)
    };
     renderModal = ()=> {
    if (Platform.OS === 'android'){
        return <View style={styles.modalViewStyle}>
            <View style={styles.hudViewStyle}>
                <View>
                    <Text style={{fontSize: 16, marginTop: 20,textAlign:'center'}}>更新提示</Text>
                </View>
                <ScrollView style={{marginVertical: 10,paddingHorizontal:15}} showsVerticalScrollIndicator={false}>
                    <Text style={{fontSize: 14}}>{this.updateConfig.message}</Text>
                </ScrollView>
                {this.updateConfig.android.flag ?
                    <TouchableOpacity activeOpacity={1} onPress={this.clickDownload}>
                        <View style={{flexDirection: 'row'}}><View style={{
                            borderTopWidth: 1,
                            borderColor: '#eeeeee',
                            height: 30,
                            width: 250,
                            justifyContent: 'center'
                        }}>
                            <Text style={{fontSize: 16, color: 'red', textAlign: 'center'}}>下载</Text>
                        </View></View></TouchableOpacity> :  <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity activeOpacity={1} onPress={this.clickDownload}>
                            <View style={{
                                borderTopWidth: 1,
                                borderColor: '#eeeeee',
                                height: 30,
                                width: 125,
                                justifyContent: 'center'
                            }}>
                                <Text style={{fontSize: 16, color: 'red', textAlign: 'center'}}>下载</Text>
                            </View></TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={this.clickToCancelModal}><View style={{
                            borderTopWidth: 1,
                            borderLeftWidth: 1,
                            height: 30,
                            width: 125,
                            borderColor: '#eeeeee',
                            justifyContent: 'center'
                        }}>
                            <Text style={{fontSize: 16, color: '#5c5c5c', textAlign: 'center'}}>取消</Text>
                        </View></TouchableOpacity></View>}
            </View>
        </View>;
    }else if(Platform.OS === 'ios'){
        return <View style={styles.modalViewStyle}>
            <View style={styles.hudViewStyle}>
                <View>
                    <Text style={{fontSize: 16, marginTop: 20,textAlign:'center'}}>更新提示</Text>
                </View>
                <ScrollView style={{marginVertical: 10,paddingHorizontal:15}} showsVerticalScrollIndicator={false}>
                    <Text style={{fontSize: 14}}>{this.updateConfig.message}</Text>
                </ScrollView>
                {this.updateConfig.ios.flag ?
                    <TouchableOpacity activeOpacity={1} onPress={this.clickDownload}>
                    <View style={{flexDirection: 'row'}}><View style={{
                        borderTopWidth: 1,
                        borderColor: '#eeeeee',
                        height: 50,
                        width: 250,
                        justifyContent: 'center'
                    }}>
                        <Text style={{fontSize: 16, color: 'red', textAlign: 'center'}}>立即更新</Text>
                    </View></View></TouchableOpacity> :  <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity activeOpacity={1} onPress={this.clickDownload}>
                        <View style={{
                            borderTopWidth: 1,
                            borderColor: '#eeeeee',
                            height: 50,
                            width: 125,
                            justifyContent: 'center'
                        }}>
                            <Text style={{fontSize: 16, color: 'red', textAlign: 'center'}}>立即更新</Text>
                        </View></TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={this.clickToCancelModal}><View style={{
                            borderTopWidth: 1,
                            borderLeftWidth: 1,
                            height: 50,
                            width: 125,
                            borderColor: '#eeeeee',
                            justifyContent: 'center'
                        }}>
                            <Text style={{fontSize: 16, color: '#5c5c5c', textAlign: 'center'}}>取消</Text>
                        </View></TouchableOpacity></View>}
            </View>
        </View>;
    }else{}

}
    render() {
        if (this.state.renderLoading) {
            return this._renderLoading();
        } else if (this.state.renderError) {
            return this._renderError();
        } else {
            if(this.state.sectionList.length<1){
                return this._renderError("暂无数据点击请求");
            }
            return (
                <View style={{flex: 1}}>
                    {Platform.OS === 'ios' ? <StatusBar barStyle="light-content"/> : null}
                    <ScrollableTabView renderTabBar={this.renderTabBar} page={this.state.page}>
                        {this.renderContent(this.state.sectionList)}
                    </ScrollableTabView>
                    <Modal
                         animationType='fade'        // 淡入淡出
                         transparent={true}              // 透明
                         visible={this.state.showModal}    // 根据isModal决定是否显示
                         onRequestClose={() => {this.onRequestClose()}}  // android必须实现
                     >
                        {this.renderModal()}
                     </Modal>
                </View>

            );
        }
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
    contain:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    footer:{
        height: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderColor: "#CED0CE"
    },
    modalViewStyle:{
        flex:1,
        position:"absolute",
        top:0,
        left:0,
        right:0,
        bottom:0,
        backgroundColor:'#0000007F',
        justifyContent:'center',
        alignItems:'center',

    },
    hudViewStyle: {
        width:250,
        maxHeight:300,
        backgroundColor:'white',
        justifyContent:'space-between',
        borderRadius:10
    },


});






