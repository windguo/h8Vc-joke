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
    Modal
} from 'react-native';
import { NavigationActions } from 'react-navigation'
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import urlConfig from '../utils/urlConfig';
import Toast from 'react-native-root-toast';
import storageKeys from '../utils/storageKeyValue';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { ifIphoneX } from '../utils/iphoneX';
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
    login = () => {
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
        Platform.OS === 'ios' ? ContentType ='application/json' : ContentType = 'multipart/form-data'
        fetch(url, {
            method: 'POST',
            headers: {'credentials': 'include',
                'Accept': 'application/json',
                'Content-Type': ContentType,
                'X-Requested-With': 'XMLHttpRequest',
                'source':'h5',
                'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',},
            body: formData
        }).then((response) =>  response.json()).then((respond) => {
            this.setState({visble:false});
            if (respond.status === 1 && respond.result){
            Toast.show('登录成功', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
             WRITE_CACHE(storageKeys.userInfo,respond.result);
             GLOBAL.userInfo = respond.result;
            this.props.navigation.goBack(null);
            this.props.navigation.state.params.callBack && this.props.navigation.state.params.callBack(respond.result.username);}
        }).catch((error) => {
            this.setState({visble:false});
            Toast.show('登录失败', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        });
    }
    render(){
        return (<ScrollView style={{backgroundColor:'white', width: WIDTH,flex:1}} contentContainerStyle={{alignItems:'center'}}>
              <View style={{marginTop:HEIGHT *0.15,width:WIDTH,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <TextInput
                    numberOfLines={1}
                    placeholder = '请输入用户名'
                    placeholderTextColor = 'black'
                    style={{width:WIDTH-80,fontSize:14,color:'black',borderWidth:1,height:40,borderColor:'#cccccc',borderRadius:10,marginHorizontal:40,backgroundColor:Color.f5f5f5,paddingHorizontal:20}}
                    onChangeText={this.userNameInputTextChange}
                    value={this.state.username} underlineColorAndroid="transparent"></TextInput>
               </View>
             <View style={{marginTop:20,width:WIDTH,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                    <TextInput
                        numberOfLines={1}
                        placeholderTextColor = 'black'
                        placeholder = '请输入密码'
                        secureTextEntry={true}
                        style={{width:WIDTH-80,fontSize:14,color:'black',borderWidth:1,height:40,borderColor:'#cccccc',borderRadius:10,marginHorizontal:40,backgroundColor:Color.f5f5f5,paddingHorizontal:20}}
                        onChangeText={this.userPwdInputTextChange}
                        value={this.state.userpwd} underlineColorAndroid="transparent"
                    />
             </View>
            <TouchableOpacity style={{
                width:WIDTH,
                alignItems: 'center',
                justifyContent:'center',
                marginTop:50,}} activeOpacity={0.7} onPress={this.loginButtonPress}>
                <View style={{
                    width:WIDTH - 80,
                    borderRadius:5,
                    height:SCALE(88),
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:'red'
                }}>
                <Text style={{fontSize:FONT(20),backgroundColor:'transparent',color:'white',textAlign:'center'}}>立即登录</Text>
                </View>
            </TouchableOpacity>
            <Modal animationType={"fade"}
                     transparent={true}
                     visible={this.state.visble}>
                <View style={[styles.load_box]}>
                    <ActivityIndicator animating={true} color={this.props.color || '#FFF'} size={'large'} style={styles.load_progress} />
                    <Text style={[styles.load_text, this.props.textStyle]}>{this.state.text}</Text>
                </View>

            </Modal>

        </ScrollView>)
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

