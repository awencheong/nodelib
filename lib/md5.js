/**
 * Created by awencheong on 2015/4/1.
 */

//当遇到中文 utf-8 格式的时候，需要将 string 转换为 buffer, 才能生成正确的 md5
var crypto = require('crypto');
function md5(str) {
    var shasum = crypto.createHash('md5');
    shasum.update(new Buffer(str));
    return shasum.digest('hex');
}
module.exports = md5;