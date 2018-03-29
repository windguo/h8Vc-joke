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
    NetInfo

} from 'react-native';
import LoadingSpinner from '../components/pull/LoadingSpinner';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Button from '../components/Button';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import {ifIphoneX} from '../utils/iphoneX';
import HomeRand from './HomeRand';
import storageKeys from '../utils/storageKeyValue'
import codePush from 'react-native-code-push'
import SplashScreen from 'react-native-splash-screen'
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HttpUtil from  '../utils/HttpUtil';
//<View style={{...header}}>
// <Image source={require('../assets/reload.png')} style={{width: 25, height: 25}}/>
export  default  class ScrollTabView extends Component {
    static navigationOptions = {
        tabBarLabel: '随机',
        tabBarIcon: ({tintColor,focused}) => (
            <IconSimple name="shuffle" size={22} color={focused ? "red":'black'} />
        ),
        header: ({navigation}) => {
            return (
                <ImageBackground style={{...header}} source={require('../assets/backgroundImageHeader.png')} resizeMode='cover'>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.state.routes[0].routes[1].params.leftFuc && navigation.state.routes[0].routes[1].params.leftFuc();
                    }}>
                        <View style={{justifyContent: 'center', marginLeft: 10, alignItems: 'center', height: 43.7}}>
                            <MaterialIcons name="search" size={25} color='white'/>
                        </View>
                    </TouchableOpacity>
                    <Text style={{fontSize: 17, textAlign: 'center', lineHeight: 43.7, color: 'white', fontWeight:'100'}}>哈吧</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.state.routes[0].routes[1].params.rightFuc && navigation.state.routes[0].routes[1].params.rightFuc();
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
        };

    }
    CodePushSync = () => {
        codePush.sync(
            {
                installMode: codePush.InstallMode.IMMEDIATE,
                updateDialog: {
                    appendReleaseDescription: true,
                    descriptionPrefix: '更新内容:',
                    mandatoryContinueButtonLabel: '更新',
                    mandatoryUpdateMessage: '有新版本了，请您及时更新',
                    optionalInstallButtonLabel: '立即更新',
                    optionalIgnoreButtonLabel: '稍后',
                    optionalUpdateMessage: '有新版本了，是否更新?',
                    title: '提示'
                },
            },
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        );
    }
    componentWillMount() {
        //监听状态改变事件
        AppState.addEventListener('change', this.handleAppStateChange);
        NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
    }
    componentDidMount() {
        if (Platform.OS === 'android'){
            NativeModules.NativeUtil.StatusBar();
        }
        SplashScreen.hide();
        this.CodePushSync();
       // WeChat.registerApp('wxd750cac4fb66b983');
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
            }
        });
        InteractionManager.runAfterInteractions(() => {
            this.loadData();
            this.setState({renderLoading:true});
        });
    }
    componentWillUnmount() {
        //删除状态改变事件监听
        AppState.removeEventListener('change');
        NetInfo.removeEventListener('connectionChange');

    }
    handleAppStateChange = (appState) => {
        console.log('当前状态为:' + appState);
        if (appState === 'active') {
            this.CodePushSync && this.CodePushSync();

        }
    }
    handleConnectivityChange = (status) =>{
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

    loadData = async()=>{
        let url = urlConfig.sectionListRand;
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
        this.setState({sectionList: result});
        WRITE_CACHE(storageKeys.sectionList, result);
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
                return <HomeRand tabLabel={data.classname} data={data} {...this.props} pageNumber={(number) => {
                    this.pageNumber(number)
                }} index={index}/>
            }));
            return list;
        }
    _renderError = ()=>{
        return (
            <View style={[styles.contain,{justifyContent:'center',alignItems:'center'}]}>
                {Platform.OS === 'ios' ? <StatusBar barStyle="light-content"/> : null}
                <TouchableOpacity onPress={()=>this.loadData()}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Image style={{width:SCALE(323),height:SCALE(271)}} source={require('../assets/nonetwork.png')}/>
                        <Text style={{fontSize:FONT(15),color:Color.C666666}}>网络无法连接，点击屏幕重试</Text>
                    </View>
                </TouchableOpacity>
            </View>)
    };
    _renderLoading = ()=> {
        return (<View style={styles.contain}>
            {Platform.OS === 'ios' ? <StatusBar barStyle="light-content"/> : null}
            <LoadingSpinner type="normal"/></View>)
    };

    render() {
        if (this.state.renderLoading) {
            return this._renderLoading();
        } else if (this.state.renderError) {
            return this._renderError();
        } else {
            return (
                <View style={{flex: 1}}>
                    {Platform.OS === 'ios' ? <StatusBar barStyle="light-content"/> : null}
                    <ScrollableTabView renderTabBar={this.renderTabBar} page={this.state.page}>
                        {this.renderContent(this.state.sectionList)}
                    </ScrollableTabView>
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
    }
});






