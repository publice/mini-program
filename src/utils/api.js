/**
 * Created by Rock on 2019/5/29.
 */

var api = {
    min_program: {
        getMini: '/WeChatMob/WeiXinClient/Sw/WxAppAuth/GetMinprogram',
        getAuth: '/WeChatMob/WeiXinClient/Sw/WxAppAuth/Login'
    },
    min_page: {
        getPage: '/wechatmob/page/mini/min_page/getPage'
    },
    crm: {
        getFans: '/WeChatMob/Member/sw/Vip/GetFans'
    },
    product: {
        getOne: '/WeChatMob/Product/Sw/Style/GetOne',
        getList: '/WeChatMob/Product/Sw/Style/GetList',
        getPriceList: '/WeChatMob/Product/Sw/Style/getPriceList'
    }
};

var apiList = (function(){
    var items = [];

    for(var menu in api){
        if(!api.hasOwnProperty(menu)){ return }

        var url = api[menu];
        for(var func in url){
            if(!url.hasOwnProperty(func)){ return }

            items['/' + menu + '/' + func] = url[func];
        }
    }

    return items;
})();

var getApi = function(url){
    return apiList[url] || '';
};

module.exports = {
    getApi: getApi
};