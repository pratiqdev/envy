import fs from 'fs';

const fileDir = './encodings/';
const baseFile = fs.readFileSync(fileDir + '.env.base', { encoding: 'utf8' })

console.log(baseFile)


const formats = [
    'utf8',
    'ascii',
    'utf16le',
    'latin1',
    'base64',
    'hex'
]

formats.forEach(format => {
    try{

        fs.writeFileSync(fileDir + `.env.encoding_${format}`, baseFile, { encoding: format })
        console.log('wrote format:', format)
    }catch(err){
        console.log(`Error writing format:`, err)
    }
})