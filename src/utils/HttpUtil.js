
import {DeviceEventEmitter,Alert,NetInfo,Platform,Dimensions} from 'react-native';
import Toast from 'react-native-root-toast'
import RNFetchBlob from 'react-native-fetch-blob'
const deviceWidth = Dimensions.get('window').width;      //设备的宽度
const deviceHeight = Dimensions.get('window').height;
const OS = Platform.OS==='ios'?'iOS':'Android';
const baseParams = {
    'credentials': 'include',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Uni-Source':'hdb/Server(PHP)',
    'source':'h5',
    'channel':'31000',
    'version':'20171010',
    'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    // 'credentials': 'include',
    // 'Uni-Source':'hdb/'+OS+' ('+'OS/'+DeviceInfo.getSystemVersion()+' APP/'+DeviceInfo.getVersion()+')',
    // 'source':Platform.OS,
    // 'channel':'31000',
    // 'version':DeviceInfo.getVersion(),
    //  'deviceToken':DeviceInfo.getUniqueID(),
    // 'imei':DeviceInfo.getUniqueID(),
    // 'os':Platform.OS,
    //  'phoneType':DeviceInfo.getModel(),
    // 'osVersion':DeviceInfo.getSystemVersion(),
    // 'screen':deviceWidth+"*"+deviceHeight,
    // 'Accept': 'application/json',
    // 'Content-Type': 'application/json',
    // 'X-Requested-With': 'XMLHttpRequest',
};
const TIMEOUT = 30000;
const CONFIG = {timeout:TIMEOUT,followRedirects:false};

export default class HttpRequest {

    static flag = true;
    static NetFlag = true;
    //监听网络连接状态
    static async checkNet(){
        let data = false;
        if(HttpRequest.NetFlag){
            HttpRequest.NetFlag = false;
            data = await NetInfo.isConnected.fetch().then((isConnected) => {
                console.log('isConnected',isConnected);
                if(!isConnected){
                    console.log('HttpUtil 发送没有网络');
                    DeviceEventEmitter.emit('data', 'NoNetWork');
                    return false;
                }else{
                    console.log('HttpUtil 不发送');
                    return true;
                }
            }).catch((err)=>{
                console.log('HttpUtil 异常');
                return false;
            });
            if(!data){
                setTimeout(()=>{HttpRequest.NetFlag = true;},3000);
            }
        }
        return data;
    };

    static async GETtype(url,headers) {
        console.log('GETtype url',url);
        let res = await RNFetchBlob.config({fileCache:true,...CONFIG}).fetch('GET',url,{
            ...baseParams,
            ...headers
        }).then((res)=>{
            console.log('res',res);
            let type = res.respInfo.headers['Content-Type'];
            console.log('type',type);
            if(type.indexOf('image')>=0){
                return true;
            }
            return false;
        }).catch(async (err) => {
            console.log('发生意外');
            if (err.message.indexOf('timed out') >= 0) {
                Toast.show('请求超时', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: false,
                    delay: 0
                });
                return false;
            }
            let check = await HttpRequest.checkNet();
            if (!check) {
                return false;
            }

            return false;
        });
        return res;
    }

    static async GET(url,headers) {
        console.log('url',HOST+url);
        let res = await RNFetchBlob.config({fileCache:true,...CONFIG}).fetch('GET',HOST+url,{
            ...baseParams,
            ...headers
        }).then((res)=>{
            console.log('res.json',res.json());
            return res.json();
        }).catch(async (err) => {
            if (err.message.indexOf('timed out') >= 0) {
                Toast.show('请求超时', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: false,
                    delay: 0
                });
                return false;
            }
            if(err.message.indexOf('JSON') >= 0) {
                Toast.show(err.message, {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: false,
                    delay: 0
                });
                return false;
            }
            let check = await HttpRequest.checkNet();
            if (!check) {
                return false;
            }
            Toast.show(err.message, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: false,
                delay: 0
            });
            console.log('其他错误',err.message);
            return false;
        });
        console.log('res',res);
        HttpRequest.emitData(res);
        return res;
    }

    static async POST(url, params, headers) {
        console.log('url', HOST + url);
        console.log('params', params);
        let res = await RNFetchBlob.config(CONFIG).fetch('POST', HOST + url, {
            ...baseParams,
            ...headers
        }, JSON.stringify(params))
            .uploadProgress((written, total) => {
                console.log('uploaded', written / total)
            })
            // listen to download progress event
            .progress((received, total) => {
                console.log('progress', received / total)
            })
            .then((res) => {
                console.log('res.json', res.json());
                return res.json();
            }).catch(async (err) => {
                console.log('err',err);
                if(err.message.indexOf('timed out') >= 0) {
                    Toast.show('请求超时', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: false,
                        delay: 0
                    });
                    return false;
                }
                if(err.message.indexOf('Unexpected') >= 0) {
                    Toast.show(err.message, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: false,
                        delay: 0
                    });
                    return false;
                }
                let check = await HttpRequest.checkNet();
                if (!check) {
                    return false;
                }
                Toast.show(err.message, {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: false,
                    delay: 0
                });
                console.log('其他错误',err.message);
                return false;
            });
        console.log('res',res);
        HttpRequest.emitData(res);
        return res;
    }

    static emitData(res){
        if(res.status==='999999'&&res.message.indexOf('登录')>-1){
            if(HttpRequest.flag){
                HttpRequest.flag = false;
                console.log('丢失cookie跳到登录页面');
                DeviceEventEmitter.emit('data', 'Login');
                setTimeout(()=>{HttpRequest.flag = true;},2000)
            }
        }
    }

    static async POSTIMAGE(url,imageSource, headers, security) {
        let formData = new FormData();
        let file = [];
        for(let i=0;i<imageSource.length;i++){
            file = {uri: imageSource[i], type: 'application/octet-stream', name: 'image.jpg'};
        }
        formData.append('file', file);
        let HEADERS = {
            'Accept': 'application/json',
            'source': 'app',
            'Content-Type' :'multipart/form-data',
            'Uni-Source':'OA/Server(PHP)',//上传图片需要的参数
        };
        let result = await fetch(url, {
            method: 'POST',
            headers: {
                ...HEADERS,
                ...headers,
            },
            body: formData
        }).then((response) => response.json()).catch((error) => {
            console.log('error', error);
        });
        HttpRequest.emitData(result);
        return result;
    }

    static async POSTImage(url, params,headers) {
        console.log('url',url);
        console.log('params', params);
        let data = [];
        for(let i=0;i<params.length;i++){
            data.push({file:{uri:params[i],type:'application/octet-stream', name: 'image.jpg'},})
        }
        console.log('images', data);
        let res = await RNFetchBlob.config(CONFIG).fetch('POST',url, {
            ...headers,
            'Accept': 'application/json',
            'source': 'app',
            'Content-Type' :'multipart/form-data',
            'Uni-Source':'OA/Server(PHP)',//上传图片需要的参数
        }, data)
            .uploadProgress((written, total) => {
                console.log('uploaded', written / total)
            })
            // listen to download progress event
            .progress((received, total) => {
                console.log('progress', received / total)
            })
            .then((res) => {
                console.log('res.json', res.json());
                return res.json();
            }).catch(async (err) => {
                let check = await HttpRequest.checkNet();
                console.log('check', check);
                if (!check) {
                    return false;
                }
                if(err.message.indexOf('timed out') >= 0) {
                    Toast.show('请求超时', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: false,
                        delay: 0
                    });
                    return false;
                }
                return false;
            });
        HttpRequest.emitData(res);
        console.log('res', res);
        return res;
    }
}


