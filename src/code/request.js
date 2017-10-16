'use strict'

import http from 'http'
import fs from 'fs'
import { config } from '../config'
import connection from './connect'

connection.connect()

let getInfo = (tid,pageno,index) => {

    http.get( `${config.comment}&tid=${tid}&pn=${pageno}`, (res) => {

        let { statusCode } = res
        let str

        statusCode !== 200 ? console.log(`请求失败,状态码 ${ statusCode }`) : console.log('请求成功，准备处理数据')

        res.on('data', (chunk) => {
            str += chunk
        })
        res.on('end',() => {
            try{
                let parsedStr = JSON.parse(str.replace(/^(undefined)/,''))
                let readStream = ''

                getStr(parsedStr.data.archives,readStream,0)

                if(parsedStr.data.archives["0"]){
                    pageno++
                    console.log(pageno) //爬取中断getinfo输入此参数继续接着先前的爬取
                    getInfo(tid, pageno)
                }else{
                    index = index < 2 && index+1
                    while (!index){
                        return '抓取完毕'
                    }
                    tid = config.tId[index]
                    pageno = 1
                    getInfo(tid, pageno)
                }

            }catch (e){
                console.log(e.message)
            }
        })
    })
}

function getStr(obj, addSqlParams, i) {
    let j = i.toString()
    let addSql = 'INSERT INTO guchu(aid,videos,tid,tname,copyright,pic,title,attribute,tags,duration,rights,stat,play,favorites,video_review,create_a,description,mid,author,face) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    if(obj[j]) {
        obj[j].tags = JSON.stringify(obj[j].tags)
        obj[j].rights = JSON.stringify(obj[j].rights)
        obj[j].stat = JSON.stringify(obj[j].stat)
        addSqlParams = Object.values(obj[j])

        // connection.query(addSql, addSqlParams, function (err, result) {
        //     if (err) {
        //         console.log('[INSERT ERROR] - ', err.message);
        //         return;
        //     }
        //     console.log('写入成功')
        // })
        i++
        getStr(obj, addSqlParams, i)

    }else {
        connection.query(addSql,addSqlParams,function(err, result){

            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            console.log('写入成功')
        })
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

export { getInfo }