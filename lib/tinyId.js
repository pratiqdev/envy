const alphanumerical = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const tinyId = (length = 16, set = alphanumerical, breakInterval = 4) => {
  let id = ''
  let breakCount = 0

  while(id.length < length + breakCount){
    let rand = Math.floor(Math.random() * set.length)
    id += set[rand]

    if(
        (id.length - breakCount !== length) 
        && (id.length - breakCount) % breakInterval === 0
    ){
      id += '-'
      breakCount++
    }
  }

  return id
}

module.exports = tinyId
