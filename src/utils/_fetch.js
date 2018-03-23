/**
 * Created by zhangzuohua on 2018/1/29.
 */
//可以设超时的fetch
function _fetch(fetch_promise, timeout) {
    var abort_fn = null;

    //这是一个可以被reject的promise
    var abort_promise = new Promise(function(resolve, reject) {
        abort_fn = function() {
            reject(new Error("请求超时"));
        };
    });

    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    var abortable_promise = Promise.race([
        fetch_promise,
        abort_promise
    ]);

    setTimeout(function() {
        abort_fn();
    }, timeout);

    return abortable_promise;

}
export default _fetch;