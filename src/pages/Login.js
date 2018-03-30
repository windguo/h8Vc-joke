/**
 * Created by zhangzuohua on 2017/10/19.
 */
import React from 'react';
import {
    StyleSheet,
    Image,
    Text,
    Linking,
    View,
    Dimensions,
    Animated,
    Easing,
    ScrollView,
    PanResponder,
    ActivityIndicator,
    TouchableOpacity,
    StatusBar,
    Platform,
    NativeModules,
    ImageBackground,
    InteractionManager,
    TouchableHighlight,
    TextInput,
    Modal,
    DeviceEventEmitter
} from 'react-native';
import { NavigationActions } from 'react-navigation'
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import urlConfig from '../utils/urlConfig';
import Toast from 'react-native-root-toast';
import storageKeys from '../utils/storageKeyValue';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { ifIphoneX } from '../utils/iphoneX';
import HttpUtil from  '../utils/HttpUtil';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default class Login extends React.Component {
    static navigationOptions = {
        header:({navigation}) =>{
            return (
                <ImageBackground style={{...header}} source={require('../assets/backgroundImageHeader.png')} resizeMode='cover'>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.goBack(null);
                    }}>
                        <View style={{justifyContent:'center',marginLeft:10,alignItems:'center',height:43.7}}>
                            <IconSimple name="arrow-left" size={20} color='white'/>
                        </View>
                    </TouchableOpacity>
                    <Text style={{fontSize:17,textAlign:'center',fontWeight:'bold',lineHeight:43.7,color:'white'}}>哈吧会员登录</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                    }}>
                        <View style={{justifyContent:'center',marginRight:10,alignItems:'center',height:43.7,backgroundColor:'transparent',width:20}}>
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
            )
        }

    };
    constructor(props){
        super(props);
        this.state = {
            username:'',
            userpwd:'',
            visble:false,
        }
    }
    componentWillUnmount() {
    }
    componentDidMount() {
    }
    disMissPress = () =>{
        this.props.navigation.goBack(null);
    }
    userPwdInputTextChange = (text) => {
        this.setState({userpwd:text})
    }
    userNameInputTextChange = (text) => {
        this.setState({username:text})
    }
    loginButtonPress = () => {
        if ( this.state.username!=''&&this.state.userpwd!=''){
            this.login();
        }else{
            alert('请输入完整的用户密码');
        }
    };
    login = async() => {
        let url = urlConfig.LoginUrl;
        let formData = new FormData();
        formData.append("hfrom", 'app');
        formData.append("enews", 'login');
        formData.append("tobind", '' + 0);
        formData.append("username", this.state.username);
        formData.append("password", this.state.userpwd);
        formData.append("Submit", '立即登录');
        console.log('formData',formData);
        this.setState({visble:true});
        let ContentType = '';
        Platform.OS === 'ios' ? ContentType ='application/json' : ContentType = 'multipart/form-data';
        const headers = {'credentials': 'include',
            'Accept': 'application/json',
            'Content-Type': ContentType,
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',};
        let res = await HttpUtil.POST(url,formData);
        console.log('xxxxxx',res);
        if (!res || !res.result){
            this.setState({visble:false});
          //  this.ToastShow('失败');
            return ;
        }
        this.setState({visble:false});
        WRITE_CACHE(storageKeys.userInfo,res.result);
        GLOBAL.userInfo = res.result;
        this.props.navigation.goBack(null);
        this.props.navigation.state.params && this.props.navigation.state.params.callBack(res.result.username);
        DeviceEventEmitter.emit('LoginSuccess');


    }
    // <ScrollView  style={{ backgroundColor:'#eeeeee', width: WIDTH,flex:1}} contentContainerStyle={{alignItems:'center'}}>
    // </ScrollView>
    render(){
        return (
            <KeyboardAwareScrollView
                enableOnAndroid = {false}>
                <ScrollView  style={{ backgroundColor:'#eeeeee', width: WIDTH,flex:1}} contentContainerStyle={{alignItems:'center'}}>
            <View style={{marginTop:HEIGHT *0.2,width:WIDTH,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <TextInput
                    numberOfLines={1}
                    placeholder = '请输入用户名'
                    placeholderTextColor = '#555555'
                    style={{ width: WIDTH - 80, fontSize: 16, color: '#555555', height: 50, backgroundColor: '#ffffff',borderRadius:10,marginHorizontal:40,paddingHorizontal:20}}
                    onChangeText={this.userNameInputTextChange}
                    value={this.state.username} underlineColorAndroid="transparent"></TextInput>
            </View>
            <View style={{marginTop:20,width:WIDTH,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <TextInput
                    numberOfLines={1}
                    placeholderTextColor = '#555555'
                    placeholder = '请输入密码'
                    secureTextEntry={true}
                    style={{ width: WIDTH - 80, fontSize: 16, color: '#555555', height: 50, backgroundColor: '#ffffff',borderRadius:10,marginHorizontal:40,paddingHorizontal:20}}
                    onChangeText={this.userPwdInputTextChange}
                    value={this.state.userpwd} underlineColorAndroid="transparent"
                />
            </View>
            <TouchableOpacity style={{
                width:WIDTH,
                alignItems: 'center',
                justifyContent:'center',
                marginTop:40,}} activeOpacity={0.7} onPress={this.loginButtonPress}>
                <View style={{
                    width:WIDTH - 80,
                    borderRadius:10,
                    height:50,
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:'#ff6600'
                }}>
                    <Text style={{fontSize:FONT(18),paddingTop:10,paddingBottom:10,backgroundColor:'transparent',color:'white',textAlign:'center'}}>立即登录</Text>
                </View>
            </TouchableOpacity>
            <Modal animationType={"fade"}
                   transparent={true}
                   visible={this.state.visble}>
                <View style={[styles.load_box]}>
                    <ActivityIndicator animating={true} color={this.props.color || '#FFF'} size={'large'} style={styles.load_progress} />
                    <Text style={[styles.load_text, this.props.textStyle]}>登录中</Text>
                </View>
            </Modal>

                </ScrollView>
            </KeyboardAwareScrollView>)
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    line1:{
        height:StyleSheet.hairlineWidth,
        width:WIDTH- SCALE(40)-SCALE(50),
        marginLeft: SCALE(40),
        backgroundColor: Color.bebebe,
        marginRight:SCALE(50)
    },
    line2:{
        height:StyleSheet.hairlineWidth,
        width:WIDTH- SCALE(40)-SCALE(50),
        marginLeft: SCALE(40),
        backgroundColor: Color.bebebe,
        marginRight:SCALE(50)
    },
    load_box: {
        width: 100,
        height: 100,
        backgroundColor: '#0008',
        alignItems: 'center',
        marginLeft: SCREEN_WIDTH / 2 - 50,
        marginTop: SCREEN_HEIGHT / 2 - 50,
        borderRadius: 10
    },
    load_progress: {
        position: 'absolute',
        width: 100,
        height: 90
    },
    load_text: {
        marginTop: 70,
        color: '#FFF',
    }

});
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

