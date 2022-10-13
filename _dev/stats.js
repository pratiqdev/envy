// import dotenv from 'dotenv'


const VARS = process.env

console.log('GET ENV:', VARS ? 'true' : 'false')
console.log('NUM ENV:', Object.entries(VARS).length)

Object.entries(VARS).forEach(([k,v]) => {
    console.log(`>> ${k}${' '.repeat(24 - typeof k === 'string' ? k.length: 10)} : ${v}`)
})