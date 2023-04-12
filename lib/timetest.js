// import envy from '../index.js'
// import fs from 'fs'
// import { v4 as uuid } from 'uuid'
// import debug from 'debug'
const envy = require('../index.js');
const fs = require('fs');
// const uuid = require('uuid').v4;
const tinyId = require('./tinyId.js')
const debug = require('debug');


const log = debug('timetest')
debug.enable('timetest')
log('TIMETEST\n')

const OUTPUT_FILE = './.env.match'
const MIN_WORD_LENGTH = 2
const MAX_WORD_LENGTH = 8
const KEY_LENGTH = 16
const NUM_LINES = 100


// log('Getting full word list...')
// let fullWordList = JSON.parse(fs.readFileSync('./node_modules/an-array-of-english-words/index.json', { encoding: 'utf-8'}))

// log('Filtering words for correct length...')
// fullWordList = fullWordList.filter((k,i) => k.length <= MAX_WORD_LENGTH && k.length >= MIN_WORD_LENGTH)

// const randomWordList = []

// while(randomWordList.length < 1000){
    // randomWordList.push(fullWordList[Math.round(Math.random() * fullWordList.length)])
// }
// log(`Creating list of ${randomWordList.length} random words...`)


const keyList = []

const getChoice = (set = randomWordList) => {
    let choice = set[Math.ceil(Math.random() * set.length - 1)]
    if(!choice || choice.length < 1 || typeof choice !== 'string') return getChoice()
    return choice.toUpperCase()
}

const safeId = (length) => {
    let l = parseInt(length) > 0 ? parseInt(length) : 12
    return tinyId().toUpperCase().replace(/-/g, '_').substring(0,l)
}


log('Creating key strings with random words')

while(keyList.length < NUM_LINES){
    keyList.push(`STRING__${safeId()}`)
    keyList.push(`NUMBER__${safeId()}`)
    keyList.push(`BOOLEAN_${safeId()}`)
    keyList.push(`OBJECT__${safeId()}`)
    keyList.push(`ARRAY___${safeId()}`)
}

const genNumber = () => {
    if(Math.random() > .5){
        return Math.round(Math.random() * 1_000_000 + Math.random() * 100)
    }else{
        return parseFloat(
            Math.round(Math.random() * 1_000_000 + Math.random() * 100)
            + '.' + Math.round(Math.random() * 1_000)
        )
    }
}
const genBoolean = () => Math.random() > .5 ? true : false

const genString = () => {
    let alpha = 'abcdefghijklmnopqrstuvwxyz'
    let str = ''
    while(str.length < 24){
        let char = alpha[Math.floor(Math.random() * alpha.length)]
        str += Math.random() > .5 ? char : char.toUpperCase()
    }
    return str
}

const genObject = () => {
    let obj = {}
    let onceRand = 3 + Math.floor(Math.random() * 30)
    while(Object.entries(obj).length < onceRand){

        let r = Math.random()

        if(r < .2){
            obj[safeId(4)] = {}
        }else if(r >= .2 && r <= .5){
            obj[safeId(4)] = safeId(4)
        }else if(r > .5 && r <= .7){
            let r1 = safeId(4)
            let r2 = safeId(4)
            let r3 = safeId(4)
            obj[r1] = {}
            obj[r1][r2] = { [r3]: safeId(4) }
        }
        else{
            let r1 = safeId(4)
            let r2 = safeId(4)
            let r3 = safeId(4)
            obj[r1] = { [r2]: r3 }
        }
  
        // log(`Adding to obj:`, obj)
    }
    return JSON.stringify(obj)
}


const genArray = () => {
    let arr = []
    let r1 = 5 + Math.floor(Math.random() * 15)
    while(arr.length < r1){
        arr.push(safeId(2 + Math.random() * 6))
    }
    return arr
}




const createData = () => {
    log(`Creating output data ...`)
    return 'FILE_NAME = .env.match\n' + keyList
    .map((k) => {
            if(k.startsWith('STRING')) return `${k} = ${genString()}`
            if(k.startsWith('NUMBER')) return `${k} = ${genNumber()}`
            if(k.startsWith('BOOLEAN')) return `${k} = ${genBoolean()}`
            if(k.startsWith('OBJECT')) return `${k} = ${genObject()}`
            if(k.startsWith('ARRAY')) return `${k} = ${genArray()}`

            return ''
        })
        .join('\n')
    }
    
try{
    log(`Creating file "${OUTPUT_FILE}" ...`)
    fs.writeFileSync(OUTPUT_FILE, createData())
}catch(err){
    log('File write error:', err)
}




//~/////////////////////////////////////////////////////////////////////////////////////////////////




const envyConfig = {}
const advConfig = {}

keyList.forEach(key => {
    let split = key.toLowerCase().split('_')
    split = split.map((s,i) => {
        // if(i > 0){
            // return s.substring(0,1).toUpperCase() + s.substring(1, s.length)
        // }else{
            return s
        // }
    }).join('')


    envyConfig[split] = key
    advConfig[split] = {
        key,
        type: 'number',
        default: 1234
    }
})

log('TESTING >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n')

const start = Date.now()
const vars = envy(null, { file: '.env.match'})
console.log('Loaded all vars in:', (Date.now() - start))


const start2 = Date.now()
const vars2 = envy(envyConfig, { file: '.env.match' })
console.log('Loaded config vars in:', (Date.now() - start))

const start3 = Date.now()
const vars3 = envy(advConfig, { file: '.env.match', coerce: true })
console.log('Loaded advanced config in:', (Date.now() - start))


// fs.writeFileSync('./env-match.json', JSON.stringify(vars3, null, 2))

// console.log('Wrote advanced envy to file "./env-match.json"')