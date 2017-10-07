import mysql from 'mysql'

const connection = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: '960810',
    database: 'bilibili'
})

export default connection