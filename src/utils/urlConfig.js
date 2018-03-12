/**
 * Created by zhangzuohua on 2018/1/22.
 */
export default urlConfig = {
  //  baseURL: 'http://jianjie.92kaifa.com',
    baseURL: 'http://h8.vc',
    //举报URL
    ReportURL: 'http://m.h8.vc/report',
    agreementURL: 'http://m.h8.vc/agreement',
    suggestURL:"http://h8.vc/e/tool/feedback/?bid=1",
    //最新更新
   //  newList: '/e/api/?getJson=new',
   // // 随机穿越
   //  randomList: '/e/api/?getJson=rand',
   //待处理
   //栏目列表 http://jianjie.92kaifa.com/e/api/getNewsClass.php
   // sectionList:'/e/api/?getJson=class',
     sectionList:'/e/api/list/new.php?getJson=class',
//随机
    sectionListRand:'/e/api/list/rand.php?getJson=class',
    //栏目列表数据后面拼接&classid=3
   // sectionListData:'/e/api/?getJson=column',
    sectionListData:'/e/api/list/new.php?getJson=column',
//随机
    sectionListDataRand:'/e/api/list/rand.php?getJson=column',
    //发布地址
    pubLishUrl:'http://m.h8.vc/fromapp',
    //点赞或者踩 {classid:2,id:2,dotop:1,doajax:1,ajaxarea:'diggnum'dotop这个字段 传0 是踩踩 传1是赞}
    thumbUpUrl:'/e/public/digg/post/index.php',
    thumbDownUrl:'/e/public/digg/post/diggbot.php',
}
//http://h8.vc/e/api/?getJson=
//这个域名是复制文本添加的域名
//m.jianjie8.com