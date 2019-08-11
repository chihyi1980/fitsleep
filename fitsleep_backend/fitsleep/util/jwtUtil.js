var jwt = require('jsonwebtoken');
var APP_ID = 'ed7fd9fcf4ad47eaa4e4a35df61cadd4';
var AK = '27ddba9f7eee401e81b011fc6c80daa7';
var SK = '65aa0c30cfc14141b8619581816401a8';

Date.prototype.format = function (format) {
    //eg:format="yyyy-MM-dd hh:mm:ss";

    if (!format) {
        format = "yyyy-MM-dd hh:mm:ss";
    }

    var o = {
        "M+": this.getMonth() + 1,  // month
        "d+": this.getDate(),       // day
        "H+": this.getHours(),      // hour
        "h+": this.getHours(),      // hour
        "m+": this.getMinutes(),    // minute
        "s+": this.getSeconds(),    // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }

    return format;
};

exports.genFtiSleepSign = function genFtiSleepSign(reqBody)
{
    var data = AK + SK + new Date().format('yyyyMMddHHmmss') + reqBody + APP_ID;
    var token = jwt.sign(data, SK);
    return token;
}