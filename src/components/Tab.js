/**
 * Created by wuyunqiang on 2017/10/18.
 */
import React, {Component} from "react";
import {
    Platform,
    View,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    DeviceEventEmitter,
    Text,
} from "react-native";
import {ifIphoneX} from '../utils/iphoneX';
export default class Tab extends Component {
    static defaultProps = {
    };

    renderItem = (route, index,count) => {
        const {
            navigation,
            jumpToIndex,
        } = this.props;

        const focused = index === navigation.state.index;
        const color = focused ? this.props.activeTintColor : this.props.inactiveTintColor;
        let TabScene = {
            focused:focused,
            route:route,
            tintColor:color
        };
        return (
            <TouchableOpacity
                key={route.key}
                onPress={() => {
                    console.log('tab index',index);
                    DeviceEventEmitter.emit('TabChange', index);
                    jumpToIndex(index);
                }}
                style={{width:WIDTH/count,flexDirection:'row', justifyContent:'space-around',}}
                activeOpacity={1}
            >
                <View
                    style={styles.tabItem}>
                    <View style={{flex:1}}/>
                    {this.props.renderIcon(TabScene)}
                    <View style={{flex:1}}/>
                    <Text style={{ ...styles.tabText }}>{this.props.getLabel(TabScene)}</Text>
                    <View style={{flex:1}}/>
                </View>
            </TouchableOpacity>
        );
    };

    render(){
        console.log('Tab this.props',this.props);
        const {navigation,} = this.props;

        const {routes,} = navigation.state;
        return (
            <View style={styles.tab}>
                {routes && routes.map((route,index) => this.renderItem(route, index,routes.length))}
            </View>
        );
    }
}


const styles = {
    tab:{
        borderTopWidth:StyleSheet.hairlineWidth,
        borderTopColor:Color.dddddd,
        width:WIDTH,
        height: Platform.OS==='ios'?ifIphoneX(83,50):50,
        backgroundColor:'white',
        flexDirection:'row',
        justifyContent:'space-around',
    },
    tabItem:{
        height:Platform.OS==='ios'?49:50,
        width:SCALE(98),
        alignItems:'center',
    },
    tabText:{
        fontSize:Platform.OS==='ios'?10:10,
        color:Color.C888888
    },
    tabTextChoose:{
        color:Color.f3474b
    },
};