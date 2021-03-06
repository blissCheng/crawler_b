'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.config = undefined;

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
    common: 'http://api.bilibili.com',
    comment: 'http://api.bilibili.com/archive_rank/getarchiverankbypartion?type=jsonp',
    tId: [22, 26, 126]
};
config.connection = _mysql2.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: '960810',
    database: 'bilibili'
});

exports.config = config;