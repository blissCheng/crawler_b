'use strict'

import http from 'http'
import fs from 'fs'
import { config } from '../config'

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

function getStr(obj, str, i) {
    let j = i.toString()
    if(obj[j]){
        if(obj[j].stat.view > 500000){
            str += `类型：${ obj[j].tname },标题：${ obj[j].title }, 播放量：${ obj[j].stat.view}, 房间号：${obj[j].aid} \n`
            console.log(`${ obj[j].title } 准备写入`)
        }
        i++
        getStr(obj, str, i)
    }else {
        new Promise((resolve, reject) => {

            let outputFile = fs.createWriteStream('./text/output.txt')

            resolve(outputFile.write(str,'UTF8'))
        }).then(() =>{
            let readerStream = fs.createReadStream('./text/output.txt'),
                writerStream = fs.createWriteStream('./text/guide.txt',{flags: 'a'})

            readerStream.pipe(writerStream);
            console.log('数据写入完成')


        }).catch((error) => {
            throw new Error(error)
        })

       // pipeHandle('../text/guide.txt')
    }
}

export { getInfo }