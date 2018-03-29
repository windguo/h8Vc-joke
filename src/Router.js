/**
 * Created by zhangzuohua on 2018/1/22.
 */
import React, {Component} from 'react';
import {
    Platform,
    View,
    I18nManager,
    TouchableOpacity,
    Easing,
    StatusBar,
    Animated,
    DeviceEventEmitter,
    Image,
} from 'react-native';
import {StackNavigator,TabNavigator} from 'react-navigation';
import Detail from '../src/pages/Detail';
import web from '../src/pages/web';
import Home from '../src/pages/Home';
import ScrollTabView from './pages/ScrollTabView';
import ScrollTabViewRand from './pages/ScrollTabViewRand';
import Tab from '../src/components/Tab'
import Login from  '../src/pages/Login'
import SearchTag from './pages/Search/index';
import Search from './pages/Search/search';
import My from './pages/My/Index';
import Publish from '../src/pages/My/Publish'
import Collection from '../src/pages/My/Collection'
import User from '../src/pages/User'
const tabbaroption = {
    activeTintColor: 'red',
    inactiveTintColor: '#999999',
    showIcon: true,
    style: {
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    indicatorStyle: {
        opacity: 0
    },
    iconStyle:{
        paddingBottom:0,
        paddingTop:0,
        padding:0,
        marginTop:0,
        marginBottom:0,
        width:SCALE(40),
        height:SCALE(40),
    },
    labelStyle:{
        paddingTop:0,
        paddingBottom:SCALE(10),
        marginTop:0,
        padding:0,
        fontSize:FONT(10),
        color:'#888888'
    },
    tabStyle: {
        height:Platform.OS==='ios'?SCALE(98):SCALE(100),
        justifyContent:'center',
        alignItems:'center'
    }
};

const _configureTransition = () => {
    return {
        duration: 100,
        timing: Animated.spring,
        tension: 800,
        friction: 100,
    };
}
const TabNavigaApp = TabNavigator({
    New: { screen: ScrollTabView },
    Rand: { screen: ScrollTabViewRand },
    My:{screen: My}
},{
    lazy: true,
    swipeEnabled: false,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    tabBarOptions: tabbaroption,
    configureTransition:()=>_configureTransition(),
    tabBarComponent:props => <Tab {...props}/>,
    // tabBarComponent:(props) => {
    //     const { navigation, navigationState } = props;
    //    // const _jumpToIndex = props.jumpToIndex; // Just in case
    //     return (<TabBarBottom {...props} jumpToIndex={(index) => {
    //         tab = navigationState.routes[index];
    //         tabRoute = tab.routeName;
    //         //firstRoute = tab.routes[0].routeName; // navState is Tabs object
    //
    //         const tabAction = NavigationActions.navigate({ routeName: tabRoute },{count:5});
    //         {/*const firstScreenAction = NavigationActions.reset({ index: 0,*/}
    //         {/*actions: [ NavigationActions.navigate({ routeName: firstRoute }) ]*/}
    //         {/*});*/}
    //         navigation.dispatch(tabAction);
    //         //navigation.dispatch(firstScreenAction);
    //     }} />)
    // }
});
const NavgationApp = StackNavigator({
    Home: {screen: Home},
    Index: {screen: TabNavigaApp},
    Detail: {screen: Detail},
    Web: {screen: web},
    Login: {screen: Login},
    Publish: {screen: Publish},
    Collection: {screen: Collection},
    User: {screen: User},
    SearchTag: {screen: SearchTag},
    Search:{screen:Search}
}, {initialRouteName: 'Index'});
export default class Router extends React.Component {
    render() {
        return <NavgationApp/>;
    }
}