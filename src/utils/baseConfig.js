/**
 * Created by zhangzuohua on 2018/2/2.
 */
export  default baseConfig = {
    BaseHeaders: {'credentials': 'include',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Uni-Source':'hdb/Server(PHP)',
    'source':'h5',
    'channel':'31000',
    'version':'20171010',
    'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'},
    BaseTimeOut:{timeout: 30000, followRedirects: false}
}