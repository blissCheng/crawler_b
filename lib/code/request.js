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

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_connect2.default.connect();

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

function getStr(obj, addSqlParams, i) {
    var j = i.toString();
    var addSql = 'INSERT INTO guchu(aid,videos,tid,tname,copyright,pic,title,attribute,tags,duration,rights,stat,play,favorites,video_review,create_a,description,mid,author,face) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    if (obj[j]) {
        obj[j].tags = JSON.stringify(obj[j].tags);
        obj[j].rights = JSON.stringify(obj[j].rights);
        obj[j].stat = JSON.stringify(obj[j].stat);
        addSqlParams = Object.values(obj[j]);

        // connection.query(addSql, addSqlParams, function (err, result) {
        //     if (err) {
        //         console.log('[INSERT ERROR] - ', err.message);
        //         return;
        //     }
        //     console.log('写入成功')
        // })
        i++;
        getStr(obj, addSqlParams, i);
    } else {
        _connect2.default.query(addSql, addSqlParams, function (err, result) {

            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            console.log('写入成功');
        });
        // new Promise((resolve, reject) => {
        //
        //     let outputFile = fs.createWriteStream('./text/output.txt')
        //
        //     resolve(outputFile.write(str,'UTF8'))
        // }).then(() =>{
        //     let readerStream = fs.createReadStream('./text/output.txt'),
        //         writerStream = fs.createWriteStream('./text/guide.txt',{flags: 'a'})
        //
        //     readerStream.pipe(writerStream);
        //     console.log('数据写入完成')
        //
        //
        // }).catch((error) => {
        //     throw new Error(error)
        // })

        // pipeHandle('../text/guide.txt')
    }
}

exports.getInfo = getInfo;