import fs from 'fs'

const pipeHandle = (readUrl, writeUrl) => {

    let readerStream = fs.createReadStream(readUrl),
        writerStream = fs.createWriteStream(writeUrl)

    readerStream.pipe(writerStream);
}