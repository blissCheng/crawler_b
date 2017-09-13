'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getInfo = function getInfo(tid, pageno) {

    _http2.default.get(_config.config.comment + '&tid=' + tid + '&pn=' + pageno, function (res) {
        var statusCode = res.statusCode;

        var str = void 0;

        statusCode !== 200 ? console.log('\u8BF7\u6C42\u5931\u8D25,\u72B6\u6001\u7801 ' + statusCode) : console.log('请求成功，准备处理数据');

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            str += chunk;
        });
        res.on('end', function () {
            try {
                //let parsedStr = JSON.parse(str)
                var writerStrem = _fs2.default.createWriteStream('../text/output.txt');
                writerStrem.write(str, 'UTF8');
                writerStrem.end();
                writerStrem.on('finish', function () {
                    console.log('写入完成');
                });
            } catch (e) {
                console.log(e.message);
            }
        });
    });
};
getInfo(_config.config.tId.guide, '1');