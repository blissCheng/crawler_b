import mysql from 'mysql'
const config = {
    common: 'http://api.bilibili.com',
    comment: 'http://api.bilibili.com/archive_rank/getarchiverankbypartion?type=jsonp',
    tId: [22,26,126]
}
config.connection = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: '960810',
    database: 'bilibili',
})


export { config }