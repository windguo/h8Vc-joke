/**
 * Created by zhangzuohua on 2018/1/26.
 */
import './storageInit'
import './StyleColor'
import {Dimensions,PixelRatio,Platform,NativeModules} from 'react-native';
export const deviceWidth = Dimensions.get('window').width;      //设备的宽度
export const deviceHeight = Dimensions.get('window').height;    //设备的高度
let fontScale = PixelRatio.getFontScale();                      //返回字体大小缩放比例
let pixelRatio = PixelRatio.get();      //当前设备的像素密度
const defaultPixel = 2;
//iphone6的像素密度
//px转换成dp
const defaultW = Platform.OS ==='ios'?750:720;
const defaultH = Platform.OS ==='ios'?1334:1280;
const w2 = defaultW / defaultPixel;
const h2 = defaultH / defaultPixel;
const scale = Math.min(deviceHeight / h2, deviceWidth / w2);   //获取缩放比例
/**
 * 设置text为sp
 * @param size sp
 * return number dp
 */
export function setSpText(size: number) {
    // size = size/pixelRatio;
    // size = Math.round((size * scale + 0.5) * pixelRatio / fontScale);
    return size;
}

export function scaleSize(size: number) {
    size = Math.round(size * scale + 0.5);
    return size / defaultPixel;
}

global.FONT = setSpText;

global.SCALE = scaleSize;

global.WIDTH = deviceWidth;

global.HEIGHT = deviceHeight;
if(__DEV__){
    // debug模式
   // global.console.log = ()=>{};
}else{
    // release模式
    global.console.log = ()=>{};
}


const StatusBarHeight =()=>{
    let height= async()=>{
        let h =  await NativeModules.NativeUtil.StatusBarHeigh();
        console.log('getStatusBarHeight',h.StatusBarHeight);
        return h.StatusBarHeight;
    };
    return height();
}


global.StatusBarHeight = StatusBarHeight;

export function ToQueryString(obj) {
    return obj
        ? Object
            .keys(obj)
            .sort()
            .map(function (key) {
                var val = obj[key];
                if (Array.isArray(val)) {
                    return val
                        .sort()
                        .map(function (val2) {
                            // return ""+key + '=' + val2;
                            return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                        })
                        .join('&');
                }

                return encodeURIComponent(key) + '=' + encodeURIComponent(val);
                // return ""+key + '=' + val;
            })
            .join('&')
        : '';
}
global.ToQueryString = ToQueryString;

