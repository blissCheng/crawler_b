'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getInfo = undefined;

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getInfo = function getInfo(tid, pageno, index) {

    _http2.default.get(_config.config.comment + '&tid=' + tid + '&pn=' + pageno, function (res) {
        var statusCode = res.statusCode;

        var str = void 0;

        statusCode !== 200 ? console.log('\u8BF7\u6C42\u5931\u8D25,\u72B6\u6001\u7801 ' + statusCode) : console.log('请求成功，准备处理数据');

        res.on('data', function (chunk) {
            str += chunk;
        });
        res.on('end', function () {
            try {
                var parsedStr = JSON.parse(str.replace(/^(undefined)/, ''));
                var readStream = '';

                getStr(parsedStr.data.archives, readStream, 0);

                if (parsedStr.data.archives["0"]) {
                    pageno++;
                    console.log(pageno); //爬取中断getinfo输入此参数继续接着先前的爬取
                    getInfo(tid, pageno);
                } else {
                    index = index < 2 && index + 1;
                    while (!index) {
                        return '抓取完毕';
                    }
                    tid = _config.config.tId[index];
                    pageno = 1;
                    getInfo(tid, pageno);
                }
            } catch (e) {
                console.log(e.message);
            }
        });
    });
};

function getStr(obj, str, i) {
    var j = i.toString();
    if (obj[j]) {

        if (obj[j].stat.view > 500000) {
            str += '\u7C7B\u578B\uFF1A' + obj[j].tname + ',\u6807\u9898\uFF1A' + obj[j].title + ', \u64AD\u653E\u91CF\uFF1A' + obj[j].stat.view + ', \u623F\u95F4\u53F7\uFF1A' + obj[j].aid + ' \n';
            console.log(obj[j].title + ' \u51C6\u5907\u5199\u5165');
        }
        i++;
        getStr(obj, str, i);
    } else {
        new Promise(function (resolve, reject) {

            var outputFile = _fs2.default.createWriteStream('./text/output.txt');

            resolve(outputFile.write(str, 'UTF8'));
        }).then(function () {
            var readerStream = _fs2.default.createReadStream('./text/output.txt'),
                writerStream = _fs2.default.createWriteStream('./text/guide.txt', { flags: 'a' });

            readerStream.pipe(writerStream);
            console.log('数据写入完成');
        }).catch(function (error) {
            throw new Error(error);
        });

        // pipeHandle('../text/guide.txt')
    }
}

exports.getInfo = getInfo;