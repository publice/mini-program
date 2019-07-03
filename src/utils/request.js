/**
 * Created by Rock on 2019/5/29.
 */
import wepy from 'wepy'
import sysConfig from './config'
import apiConfig from './api'
import md5 from './md5'

const checkAuth = (options, callback) => {
    options = Object.assign({
        target: 'index',
        isLogin: false //是否必须注册
    }, options);

    var user = wepy.getStorageSync('user');

    var date = new Date();
    date.setHours(3);
    date.setMinutes(0);
    date.setSeconds(0);
    var time = date.getTime();

    if(!user || !user.OpenId){
        wepy.removeStorageSync('user');
        redirect_auth(options.target);
    }else if(user.timestamp < time){
        getAuth(user.GzNo, user.OpenId).then(function(res){
            if(res.IsSuccess){
                if(!options.isLogin || res.TModel.IsVip){
                    typeof callback === 'function' && callback();
                }else{
                    redirect_login(options.target);
                }
            }
        })
    }else{
        typeof callback === 'function' && callback();
    }
}

const getAuth = async (gzNo, openId) => {
    let res = await post('/min_program/getAuth', {GzNo: gzNo, OpenId: openId});

    if(res.IsSuccess){
        var timestamp = Math.round(new Date().getTime() / 1000);
        var sign = md5.hex_md5(res.TModel.UserInfo + res.TModel.Token + timestamp).toLowerCase();
        res.TModel.Auth = 'SW-Authorization ' + res.TModel.UserInfo + ';' + timestamp + ';' + sign;
        res.TModel.timestamp = new Date().getTime();

        wepy.setStorageSync('user', res.TModel);
    }else{
        toast(gzNo + openId + res.Message);
    }

    return res;
}

const post = async (url = '', data = {}, params = {}) => {
    var config = new Config(params);
    var request = new Request(url);

    if(!request.result.IsSuccess){
        return request.result;
    }

    request.showLoading(config);

    let res = await wepy.request({
        url: request.url,
        method: 'POST',
        data: data,
        header: request.header
    }).catch(function(err){ return err });

    request.hideLoading();

    if(res.statusCode === 200){
        return res.data;
    }else{
        return {IsSuccess: false, Message: '无法连接服务器，请检查网络！'}
    }

}

const toast = (title = 'interface error', icon = 'none', duration = 3000) => {
    wepy.showToast({title: title, icon: icon, duration: duration});
}

function Result(){
    this.IsSuccess = false;
    this.Message = false;
    this.TModel = null;
}

function Config(params){
    this.showLoading = !(params.showLoading === false)
}

function Request(url) {
    this.result = new Result();
    this.url = this.initUrl(url);
    this.header = this.initHeader();
    this.hasLoading = false;
}
Request.prototype.initUrl = function(url){
    if(!url){
        this.result.Message = 'url can not be empty!';
        return ''
    }

    var api = apiConfig.getApi(url);

    if(!api){
        this.result.Message = url + ' is not support!';
        return ''
    }

    this.result.IsSuccess = true;

    return api.indexOf('http') >= 0 ? api : sysConfig.apiMail + api;
};
Request.prototype.initHeader = function(){
    var user = wx.getStorageSync('user');

    return {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: user ? user.Auth : ''
    };
};
Request.prototype.showLoading = function(config){
    if(config.showLoading){
        this.hasLoading = true;
        wepy.showLoading({title: '加载中', mask: true});
    }
};
Request.prototype.hideLoading = function(){
    if(this.hasLoading){
        wepy.hideLoading();
    }
};

function redirect_auth(target){
    wepy.redirectTo({url: '/pages/oauth?target=' + target})
}
function redirect_login(target){
    wepy.redirectTo({url: '/pages/login?target=' + target})
}


module.exports = {
    post,
    toast,
    checkAuth,
    getAuth
};