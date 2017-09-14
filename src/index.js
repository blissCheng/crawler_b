/*
*/
'use strict'
import { config } from './config'
import { getInfo } from './code/request'

//tid 鬼畜类型
//pageno初始抓取页面
//index类型索引
getInfo(config.tId[0], 1, 0)



