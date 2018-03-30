import React, { Component } from 'react';
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
import _fetch from '../../utils/_fetch'
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import { ifIphoneX } from '../../utils/iphoneX';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import urlConfig from '../../utils/urlConfig';
import PureModalUtil from '../../utils/PureModalUtil';
import * as WeChat from 'react-native-wechat';
import storageKeys from '../../utils/storageKeyValue'
import ScrollTabView from "../ScrollTabView";
import PullList from '../../components/pull/PullList'
import ModalUtil from '../../utils/modalUtil';
import HttpUtil from "../../utils/HttpUtil";
import formatData from "../../utils/formatData";
import LoadingView from "../../components/LoadingView";
export default class SearchTag extends Component {

    static key = "";
    static navigationOptions = {
        tabBarLabel: '搜索',
        tabBarIcon: ({ tintColor, focused }) => (
            <IconSimple name="user" size={22} color={focused ? "red" : 'black'} />
        ),
        header: ({ navigation }) => {
            let textinput;
            return (
                <ImageBackground style={{ ...header }} source={require('../../assets/backgroundImageHeader.png')} resizeMode='cover'>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.goBack(null);
                    }}>
                        <View style={{ justifyContent: 'center', marginLeft: 10, alignItems: 'center', height: 43.7 }}>
                            <IconSimple name="arrow-left" size={20} color='white' />
                        </View>
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center', 
                        marginLeft: 10, 
                        alignItems: 'center', 
                        height: 43.7
                    }}>
                        <TextInput
                            ref = {(text)=>{textinput = text}}
                            placeholder='请输入关键字'
                            placeholderTextColor='#555555'
                            autoFocus={true}
                            onChangeText={(keywords) => {
                                SearchTag.key = keywords;
                                navigation.state.routes[navigation.state.routes.length-1].params && navigation.state.routes[navigation.state.routes.length-1].params.changeText(SearchTag.key)
                                console.log("navigation",navigation)
                            }}
                            defaultValue={navigation.state.routes[navigation.state.routes.length-1].params && navigation.state.routes[navigation.state.routes.length-1].params.key}
                            style={{ 
                                fontSize: 16,
                                color: '#555555',
                                borderRadius: 10,
                                marginHorizontal: 20, 
                                width: WIDTH - 140,
                                height: 32,
                                paddingHorizontal: 20,
                                paddingTop:0,
                                paddingBottom:0,
                                backgroundColor: '#ffffff'
                            }}
                            underlineColorAndroid="transparent">
                        </TextInput>
                        <View style={{
                            position:'absolute',
                            right:navigation.state.routes[navigation.state.routes.length-1].params
                            && navigation.state.routes[navigation.state.routes.length-1].params.changetext
                            && navigation.state.routes[navigation.state.routes.length-1].params.changetext.length>0?70:1000}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={
                                ()=>{
                                    SearchTag.key = "";
                                    textinput&&textinput.clear();
                                    navigation.state.routes[navigation.state.routes.length-1].params && navigation.state.routes[navigation.state.routes.length-1].params.changeText(SearchTag.key)

                                }
                            }>
                                <IconSimple name="close" size={22}/>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={{}} activeOpacity={0.7} onPress={() => {
                            console.log("header navigation",navigation)
                            console.log("SearchTag.key",SearchTag.key);
                            navigation.state.routes[navigation.state.routes.length-1].params && navigation.state.routes[navigation.state.routes.length-1].params.searchKey(SearchTag.key);
                            }}>
                            <View>
                                <Text style={{color: '#ffffff',fontWeight:'bold',fontSize:16,marginRight:10}}>搜 索</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            )
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            tag:[]
        };
    }
    componentWillMount() {
        this._ViewHeight = new Animated.Value(0);
    }
    componentDidMount() {
        this.props.navigation.setParams({
            searchKey:this.searchKey,
            changeText:this.changeText
        });
        this.loadinit();
    }

    loadinit = async()=>{
        let  url =  urlConfig.Search + "keyword";
        let res = await HttpUtil.GET(url);
        if(!res||!res.result){
            return;
        }
        let result = res.result ? res.result:[];
        this.setState({
            tag:result,
        })
        console.log("result",result);
    }


    //点击搜索
    searchKey = (keyword)=>{
        // console.log("navigation",this.props.navigation);
        this.props.navigation.setParams({ key: keyword,changetext:keyword });
        this.props.navigation.navigate("Search",{key:keyword});
    }

    //监听输入改变 是否显示取消按钮
    changeText = (text)=>{
        this.props.navigation.setParams({
            changetext:text
        })
    }


    renderTag = () => {
        let tags = [];
        for (let i = 0; i < this.state.tag.length; i++) {
            tags.push(
                <TouchableOpacity key={i}
                                  activeOpacity={0.8}
                                  onPress={() => this.searchKey(this.state.tag[i].name)}>
                    <View style={{
                        width: 70, height: 40, backgroundColor: 'white', justifyContent: 'center',
                        alignItems: 'center', borderRadius: 20, marginBottom: 20, marginRight: 10
                    }}>
                        <Text style={{fontSize: 16}}>{this.state.tag[i].name}</Text>
                    </View>
                </TouchableOpacity>)
        }
        return tags;
    }

    render() {
        if(this.state.tag.length>0){
            return (
                <ScrollView
                    style={{flex:1}}
                    contentContainerStyle={{flex: 1,marginLeft:10,marginTop:20,flexDirection:'row', flexWrap:'wrap',justifyContent:'center'}} >
                    {this.renderTag()}
                </ScrollView>
            );
        }


        return  <View style={{width:"100%",height:"100%", justifyContent:'center', alignItems:"center"}}>
            <LoadingView visible={true}/>
        </View>



    }

}

const header = {
    backgroundColor: '#C7272F',
    ...ifIphoneX({
        paddingTop: 44,
        height: 88
    }, {
            paddingTop: Platform.OS === "ios" ? 20 : SCALE(StatusBarHeight()),
            height: 64,
        }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
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





