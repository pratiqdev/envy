// import dotenv from 'dotenv'


const VARS = process.env

console.log('GET ENV:', VARS ? 'true' : 'false')
console.log('NUM ENV:', Object.entries(VARS).length)

Object.entries(VARS).forEach(([k,v]) => {
    console.log(`>> ${k} \n\t ${v}`)
})