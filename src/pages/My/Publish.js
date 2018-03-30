
/**
 * Created by zhangzuohua on 2018/1/22.
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
    Clipboard
} from 'react-native';
import urlConfig  from  '../../utils/urlConfig';
import ModalUtil from '../../utils/modalUtil';
import formatData from '../../utils/formatData';
import Toast from 'react-native-root-toast';
import LoadError from  '../../components/loadError';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import PullList from '../../components/pull/PullList'
import storageKeys from '../../utils/storageKeyValue'
import * as WeChat from 'react-native-wechat';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import HttpUtil from  '../../utils/HttpUtil';
import { ifIphoneX } from '../../utils/iphoneX';
import AutoHeightImage from 'react-native-auto-height-image';
import CustomImage from '../../components/CustomImage'
import GuessText from  '../../components/GuessText'
import ImageProgress from 'react-native-image-progress';
import {Pie,Bar,Circle,CircleSnail} from 'react-native-progress';
export default class MyCollectLaugh extends Component {
    static navigationOptions = {
        header:({navigation}) =>{
            return (
                <ImageBackground style={{...header}} source={require('../../assets/backgroundImageHeader.png')} resizeMode='cover'>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.goBack(null);
                    }}>
                        <View style={{justifyContent:'center',marginLeft:10,alignItems:'center',height:43.7}}>
                            <IconSimple name="arrow-left" size={20} color='white'/>
                        </View>
                    </TouchableOpacity>
                    <Text style={{fontSize:17,textAlign:'center',fontWeight:'bold',lineHeight:43.7,color:'white'}}>我发布的内容</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                    }}>
                        <View style={{justifyContent:'center',marginRight:10,alignItems:'center',height:43.7,backgroundColor:'transparent',width:20}}>
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
            )
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loadError:false,
            loadNewData:false,
            visible:false,
            ViewHeight:new Animated.Value(0)
        };
        //每次请求需要需要加pagenumber
        this.requestPageNumber = 1;
    }
    componentWillMount() {
        this._ViewHeight = new Animated.Value(0);
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData();
        });
    }
    componentWillUnmount() {
    }
    setClipboardContent = (text,index,item) => {
        if(item.classid === '41' || item.classid === '44' || item.classid === '39'){
            return ;
        }
        try {
            let DeepCopyData = [].concat(JSON.parse(JSON.stringify(this.FlatListData)));
            DeepCopyData[index].isCopyed = true;
            this.flatList.setData(DeepCopyData);
            Clipboard.setString(item.smalltext && item.smalltext.replace(/^(\r\n)|(\n)|(\r)/,"") + urlConfig.DetailUrl + item.classid + '/' + item.id);
            Toast.show('复制成功', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        }catch (e){}
    }

    share = async()=>{
        //    alert(JSON.stringify(this._shareItem));
        let data = await NativeModules.NativeUtil.showDialog();
        if (data.wechat === 3){
            this.clickToReport();
            return;
        }
        if(data){
            WeChat.isWXAppInstalled().then((isInstalled) => {
                if (isInstalled) {
                    if (data.wechat === 1) {
                        WeChat.shareToSession({
                            title: "【哈吧笑话分享】",
                            description: this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                            type: 'news',
                            webpageUrl: urlConfig.DetailUrl + this._shareItem.classid + '/' + this._shareItem.id,
                            thumbImage: urlConfig.thumbImage,
                        }).then((message)=>{message.errCode === 0  ? this.ToastShow('分享成功') : this.ToastShow('分享失败')}).catch((error) => {
                            if (error.message != -2) {
                                Toast.show(error.message);
                            }
                        });
                    } else if(data.wechat === 2){
                        WeChat.shareToTimeline({
                            title: "【哈吧笑话分享】" + this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                            description: this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                            type: 'news',
                            webpageUrl: urlConfig.DetailUrl + this._shareItem.classid + '/' + this._shareItem.id,
                            thumbImage: urlConfig.thumbImage,
                        }).then((message)=>{message.errCode === 0  ? this.ToastShow('分享成功') : this.ToastShow('分享失败')}).catch((error) => {
                            if (error.message != -2) {
                                Toast.show(error.message);
                            }
                        });
                    }
                } else {
                    Toast.show("没有安装微信软件，请您安装微信之后再试");
                }
            });
            console.log('data',data)
        }
    }
    clickToReport = () => {
        let url = urlConfig.ReportURL + '/' + this._shareItem.classid + '/' + this._shareItem.id;
        this.props.navigation.navigate('Web', {url:url});
        this.close();
    }
    clickToShare = (type) => {
        this.close();
        WeChat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                if (type === 'Session') {
                    WeChat.shareToSession({
                        title: "【哈吧笑话分享】",
                        description: this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                        type: 'news',
                        webpageUrl: urlConfig.DetailUrl + this._shareItem.classid + '/' + this._shareItem.id,
                        thumbImage: urlConfig.thumbImage,
                    }).then((message)=>{message.errCode === 0  ? this.ToastShow('分享成功') : this.ToastShow('分享失败')}).catch((e)=>{if (error.message != -2) {
                        Toast.show(error.message);
                    }});
                } else {
                    WeChat.shareToTimeline({
                        title: "【哈吧笑话分享】" + this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                        description: this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                        type: 'news',
                        webpageUrl: urlConfig.DetailUrl + this._shareItem.classid + '/' + this._shareItem.id,
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
                            <TouchableOpacity
                                style={styles.base}
                                onPress={()=>this.clickToReport()}
                            >
                                <View style={styles.shareContent}>
                                    <IconSimple name="exclamation" size={40} color='black'/>
                                    <Text style={styles.spinnerTitle}>举报</Text>
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
    show = (item)=>{
        this._shareItem = item;
        if(Platform.OS==='android'){
            this.share()
            return;
        }
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
    dealWithrequestPage = () =>{
        return  this.requestPageNumber > 1 ? '&page=' + this.requestPageNumber : ''
    }
    loadData = async(resolve)=>{
        let url = urlConfig.MyPublishUrl + '&userid=' + GLOBAL.userInfo.userid;
        console.log('loadUrl',url);
        let res = await HttpUtil.GET(url);
        resolve && resolve();
        if(!res||!res.result){
            return;
        }
        let result = res.result ? res.result:[];
        this.flatList && this.flatList.setData(this.dealWithLongArray(result), 0);
        console.log('res', res);
    };
    dealWithLongArray = (dataArray) => {
        //下拉刷新来几条数据，就对应的删除几条数据 ，以便填充
        let initArray = [];
        if (this.FlatListData){
            if (this.FlatListData.length > dataArray.length ){
                initArray = this.FlatListData.slice(dataArray.length,this.FlatListData.length);
            }else{
                initArray = [];
            }
        }
        let waitDealArray = dataArray.concat(initArray).filter((value)=>{return !(!value || value === "");});
        if (waitDealArray.length >= 50) {
            waitDealArray = waitDealArray.slice(0, 50);
            console.log('处理过的array', waitDealArray);
        }
        this.FlatListData = waitDealArray;
        return waitDealArray;
    }
    dealWithLoadMoreData = (dataArray) => {
        // let waitDealArray = this.state.data.concat(dataArray);
        console.log('loadMoreData',dataArray);
        let waitDealArray =this.FlatListData.concat(dataArray).filter((value)=>{return !(!value || value === "");});
        console.log('loadMoreDatacontact',waitDealArray);
        if (waitDealArray.length >= 50) {
            waitDealArray = waitDealArray.slice(waitDealArray.length -50, waitDealArray.length);
            console.log('处理过的array', waitDealArray);
        }
        this.FlatListData = waitDealArray;
        return waitDealArray;
    }
    ToastShow = (message) => {
        Toast.show(message, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });
    }
    PostThumb = async(item,dotop,index) => {
        try {
            let upDownData = [].concat(JSON.parse(JSON.stringify(this.FlatListData)));
            if (dotop === 0) {
                upDownData[index].isUnLike = true;
                upDownData[index].diggbot = (parseInt(upDownData[index].diggbot) - 1).toString();

            }
            if (dotop === 1) {
                upDownData[index].isLike = true;
                upDownData[index].diggtop = (parseInt(upDownData[index].diggtop) + 1).toString();
            }

            let url = '';
            if (dotop === 0) {
                url = urlConfig.thumbDownUrl;
            } else if (dotop === 1) {
                url = urlConfig.thumbUpUrl;
            }
            //不用formdate后台解析不出来
            let formData = new FormData();
            formData.append("id", item.id);
            formData.append("classid", item.classid);
            formData.append("dotop", '' + dotop);
            formData.append("doajax", '' + 1);
            formData.append("ajaxarea", "diggnum");
            let res = await HttpUtil.POST(url,formData,'dotop');
            if (!res){
                return ;
            }
            let message = '';
            let array = res._bodyInit.split('|');
            if (array.length > 0) {
                message = array[array.length - 1];
            }
            if (message === '谢谢您的支持' || message === '谢谢您的意见') {
                this.flatList.setData(upDownData);
                //只能操作数据源修改列表数据  很大的损耗啊
                this.FlatListData = upDownData;
            }
            this.ToastShow(message);
        }catch (e){}
    }
    clickToFavas = (classid,id) => {
        let url = urlConfig.FavasURL + '/' + classid + '/' + id;
        this.props.navigation.navigate('Web', { url: url });
    }

    renderTextAndImage = (item,index) => {
        if (item.classid === '39'|| item.classid === '41'){
            return  <View>
                <Text style={{
                    fontSize: 16,
                    lineHeight: 26,
                    color:item.isCopyed ? '#666666' : 'black',
                    fontWeight:'300'
                }} onPress={()=>{this.setClipboardContent(item.smalltext && item.smalltext,index,item)}}>{item.smalltext && item.smalltext.replace(/^(\r\n)|(\n)|(\r)/,"")}</Text>
                {item.pic_urls ? <CustomImage titlepic={item.titlepic} pic_urls={item.pic_urls} style={{marginTop:10}}
                /> : <View/> }
            </View>
        }else if( item.classid === '42'){
            return  <View>
                {item.titlepic ? <AutoHeightImage
                    width={WIDTH-40}
                    source = {{uri:item.titlepic}}
                /> : <View/> }
            </View>
        }else if (item.classid === '44') {
            return   <View>
                <Text style={{
                    fontSize: 16,
                    lineHeight: 26,
                    color:item.isCopyed ? '#666666' : 'black',
                    fontWeight:'300'
                }} onPress={()=>{this.setClipboardContent(item.smalltext && item.smalltext,index,item)}}>{item.smalltext && item.smalltext.replace(/^(\r\n)|(\n)|(\r)/,"")}</Text>
                <GuessText style={{fontSize:16,color:Color.redColor,marginTop:10}} item={item}>查看答案</GuessText>
            </View>
        }else {
            return  <View>
                <Text style={{
                    fontSize: 16,
                    lineHeight: 26,
                    color:item.isCopyed ? '#666666' : 'black',
                    fontWeight:'300'
                }} onPress={()=>{this.setClipboardContent(item.smalltext && item.smalltext,index,item)}}>{item.smalltext && item.smalltext.replace(/^(\r\n)|(\n)|(\r)/,"")}</Text>
            </View>
        }
    }
    _renderItem = ({item, index}) => {
        if (item.adType && item.picUrl) {
            return  <TouchableOpacity activeOpacity={1} onPress={() => {
            }}>
                <View style={{backgroundColor:'#ffffff',flexDirection: 'row', paddingHorizontal: 20, paddingVertical:15, justifyContent: 'center',alignItems:'center'}}>
                    { item.picUrl ? <ImageProgress
                        source={{ uri: item.picUrl }}
                        resizeMode={'cover'}
                        indicator={Pie}
                        indicatorProps={{
                            size: 40,
                            borderWidth: 0,
                            color: 'rgba(255, 160, 0, 0.8)',
                            unfilledColor: 'rgba(200, 200, 200, 0.1)'
                        }}
                        style={{width:WIDTH-40,height:100}} />  : null }
                </View>
            </TouchableOpacity>
        }
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {
            }}>
                <View>
                    {index === 0 ? <View style={{width:WIDTH,height:10,backgroundColor:Color.f5f5f5}}/> :<View/>}
                    <View style={{ backgroundColor:'#ffffff',flexDirection: 'row', paddingHorizontal: 20, paddingTop: 15, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#666666', fontWeight: '100' }} onPress={() => {
                                this.props.navigation.navigate('User', {
                                    username: item.username,
                                    userid: item.userid
                                });
                            }}>
                                (O ^
                                <Text>
                                    {item.username}
                                </Text>
                                ^ O)
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <Text style={{
                                    paddingVertical: 2,
                                    color: '#666666',
                                    fontWeight: '100'
                                }}>
                                    {formatData(parseInt(item.newstime))}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', paddingHorizontal: 20,paddingTop:10}}>
                        {this.renderTextAndImage(item,index)}
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 15,
                                marginBottom:15,
                                justifyContent: 'space-between',
                            }}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity activeOpacity={1}
                                                  onPress={() => {
                                                      this.clickToFavas(item.classid, item.id)
                                                  }}
                                                  hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                                    <IconSimple name="wallet" size={15} color='#5C5C5C' />
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'row',marginLeft: 10}}>
                                    <TouchableOpacity activeOpacity={1} onPress={()=>{this.PostThumb(item,1,index)}} hitSlop={{left:10,right:10,top:10,bottom:10}}>
                                        {item.isLike ?   <IconSimple name="like" size={15} color='red'/> : <IconSimple name="like" size={15} color='#5C5C5C'/>}
                                    </TouchableOpacity>
                                    <Text style={{marginLeft: 5,fontWeight:'100'}}>{item.diggtop && item.diggtop}</Text>
                                </View>
                                <View style={{flexDirection: 'row', marginLeft: 10}}>
                                    <TouchableOpacity activeOpacity={1} onPress={()=>{this.PostThumb(item,0,index)}} hitSlop={{left:10,right:10,top:10,bottom:10}}>
                                        {item.isUnLike ?   <IconSimple name="dislike" size={15} color='red'/> : <IconSimple name="dislike" size={15} color='#5C5C5C'/>}
                                    </TouchableOpacity>
                                    <Text style={{marginLeft: 5,fontWeight:'100'}}>{item.diggbot && item.diggbot}</Text>
                                </View>
                                <View style={{flexDirection: 'row', marginLeft: 10}}>
                                    <TouchableOpacity activeOpacity={1} onPress={()=> { this.show(item)}} hitSlop={{left:10,right:10,top:10,bottom:10}}>
                                        <IconSimple name="share" size={15} color='#5C5C5C'/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    onPullRelease = async (resolve) => {
        this.loadData(resolve);
    };

    loadMore = async()=>{
        this.requestPageNumber += 1;
        let url = urlConfig.MyPublishUrl  + '&userid=' + GLOBAL.userInfo.userid + this.dealWithrequestPage();
        let res = await HttpUtil.GET(url);
        if(!res||!res.result){
            return;
        }
        let result = res.result ? res.result:[];
        this.flatList && this.flatList.setData(this.dealWithLoadMoreData(result));
        console.log('res', res);
    };
    _keyExtractor = (item, index) => index;
    render() {
        return (
            <View style={{flex: 1}} >
                <PullList
                    //  data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    onPullRelease={this.onPullRelease}
                    renderItem={this._renderItem}
                    onEndReached={this.loadMore}
                    style={{backgroundColor: Color.f5f5f5}}
                    ref={(c) => {this.flatList = c}}
                    ifRenderFooter={true}
                />
                <ModalUtil
                    visible = {this.state.visible}
                    close = {this.close}
                    contentView = {this.renderSpinner}/>
            </View>
        );
    }
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