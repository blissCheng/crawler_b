/*
*/
'use strict';

var _config = require('./config');

var _request = require('./code/request');

//tid 鬼畜类型
//pageno初始抓取页面
//index类型索引
(0, _request.getInfo)(_config.config.tId[0], 1, 0);