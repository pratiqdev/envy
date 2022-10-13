// let falseBoolStrings = [
//     '',
//     '0',
//     '-1',
//     'false',
//     'false   ',
//     'FALSE',
//     'TRU',
//     'fal',
//     'null',
//     'undefined',
// ]

// let trueBoolStrings = [
//     '1',
//     '567',
//     '1e5',
//     'true',
//     'true   ',
//     'TRUE',
//     '  TRUE ',
// ]

// const compare = (v) => {
//     let b = false
//     v = v.trim().toLowerCase()

//     // if(
//     //     parseInt(v) === NaN
//     //     || parseFloat(v) === NaN
//     //     || parseInt(v) <= 0
//     //     || parseFloat(v) <= 0
//     //     || v !== 'true'
//     // ){
//     //     b = false
//     // }

//     if(
//         parseInt(v) > 0
//         || parseFloat(v) > 0
//         || v === 'true'
//     ){
//         b = true
//     }

//     return b
// }

// let allFalse = falseBoolStrings.map((v,i,a) => `${a[i]} : ${compare(v)}`)
// let allTrue = trueBoolStrings.map((v,i,a) => ` "${a[i]}" : ${compare(v)}`)

// console.log({
//     allFalse,
//     allTrue,
// })

// 1
// 100
// 80
// 3.42
// 0000.0000
// 123_456_789
// 123__456_78_9
// 123,456.789

// 123,,456
// 123,456.789.0
// 7423&90234
// 7423L90234
// 2323.234.23
// 23242,432.23.34_234
// 123 456.789

// const dint = (val) => {
//     console.log('dot matches:', val.match(/\./g)?.length ?? 0)


//     if(/^-?[0-9,\._]+$/.test(val) && (val.match(/\./g)?.length ?? 0) <= 1){
//         val = val
//             .replace(/_/g, '')
//             .replace(/,/g, '')
    
//         if(val.includes('.')){
//             console.log(val + ': ' + parseFloat(val))
//         }else{
//             console.log(val + ': ' + parseInt(val))
//         }
//     }else{
//         console.log(val + ': Not number...')
//     }

// }

// dint('1')
// dint('100')
// dint('80')
// dint('3.42')
// dint('0000.0000')
// dint('123_456_789')
// dint('123__456_78_9')
// dint('123,456.789')
// dint('123,,456')
// dint('123,456.789.0')
// dint('2345l23455432')
// dint('234245&234')
// dint('243,234.34.34_432')
// dint('123 456.789')

const str = "{\"11DE\":{\"F25B\":{\"287B\":\"5B1A\"}},\"D6CF\":\"9A0C\",\"8DB8\":\"73DA\"}"
console.log(JSON.parse(str))