/**
 * Created by Rock on 2019/6/5.
 */


function parseToMoney(num, dec = 2){
    num = parseFloat(num.toFixed(dec));
    let [integer, decimal = ''] = String.prototype.split.call(num, '.');
    integer = integer.replace(/\d(?=(\d{3})+$)/g, '$&,');
    let len = decimal.length;
    if(dec > 0 && len < dec){
        for(let i = len; i < dec; i++){
            decimal += '0';
        }
    }
    return '¥ ' + integer + (dec > 0 ? '.' + decimal : '');
}

module.exports = {
    parseToMoney: parseToMoney
}