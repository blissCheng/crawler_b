'use strict'

import http from 'http'
import fs from 'fs'
import { config } from '../config'


let getInfo = ( tid, pageno ) => {

    http.get( `${config.comment}&tid=${tid}&pn=${pageno}`, (res) => {

        let { statusCode } = res
        let str

        statusCode !== 200 ? console.log(`请求失败,状态码 ${ statusCode }`) : console.log('请求成功，准备处理数据')

        res.setEncoding('utf8')
        res.on('data', (chunk) => {
            str += chunk
        })
        res.on('end',() => {
            try{
                let parsedStr = JSON.parse(str)
                let writerStrem = fs.createWriteStream('../text/output.txt')
                writerStrem.write(str,'UTF8');
                writerStrem.end();
                writerStrem.on('finish', function () {
                    console.log('写入完成')
                })
            }catch (e){
                console.log(e.message)
            }
        })
    })
}

const pipeHandle = (data) => {
    let readerStream = fs.createReadStream(data),
        writerStream = fs.createWriteStream()
}
getInfo(config.tId.guide, '1')