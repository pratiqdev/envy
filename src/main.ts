import clr from './colors.js'
import dotenv from 'dotenv'
import debug from 'debug'
import {resolve} from 'path'

const log = {
    main:       debug('envy:main    '),
    config:     debug('envy:config  '),
    options:    debug('envy:options '),
    settings:   debug('envy:settings'),
    parse:      debug('envy:parse   '),
    error:      debug('envy:-----   '),
    set:        debug('envy:set     '),
    coerce:     debug('envy:coerce  '),
    return:     debug('envy:return  '),
    test:       debug('envy:test')
}

import { 
    EnvyConfig,
    EnvyOptions,
    EnvyParseConfig,
    EnvyParseItem,
    Coerce,
    Verbose,
    EnvyReturnObject
} from './types.js'    





/** ### ε η ν ψ  
 * Load and parse environment variables.
 * 
 *  ---
 *
 *  #### Config
 *
 *  An object of key-values containing parser instructions. See `EnvyConfigItem`
 *
 *  | option | type | default | description |
 *  |:--|:--|:--|:--|
 *  key | `string` | `null` | The key to assign the found value to
 *  type | `CoerceTypes` | `null`| The type to coerce the found values to
 *  default | `string` | `undefined` | The default value to use if the env values is not found
 *
 *  ---
 *
 *  #### Options
 * 
 *  | option | type | default | description |
 *  |:--|:--|:--|:--|
 *  type | `CoerceTypes` | `null` | The global type to coerce all values to, unless locally overridden
 *  prefix | `string` | `null` | The prefix to match and replace for all keys
 *  coerce | `boolean` | `false` | Enable automatic type coercion
 *  verbose | `0, 1, 2` | `0` | Enable log/error on undefined keys or coercion errors. See VerboseTypes
 *  file | `string` | `"inherit"` | Path to custom .env file, or 'inherit' (default) to use `.env.NODE_ENV`
 *  override | `boolean` | `true` | Enable overriding key-values which are already set
 *  encoding | `EncodingTypes` | `"utf8"` | Parse and load .env files with alternate encoding types
 * 
 *  ---
 *  @example
 *  const ENV = envy({
 *     prefix: 'MY_LONG_PREFIX_',
 *     file: 'inherit'
 *  })
 *
 *
*/

const envy = (config?: EnvyConfig | EnvyOptions, options?: EnvyOptions): EnvyReturnObject => {
    log.main('ENVY START ' + '='.repeat(60))
    log.config(JSON.stringify(config, null, 2))
    log.options(JSON.stringify(options, null, 2))

    if(typeof config === 'object' && !options){
        options = config as EnvyOptions
    }

    //& define a settings object based on config                                                    
    let settings = {
        globalType: options?.type                                   ?? '',
        prefix: options?.prefix                                     ?? null,
        coerce: options?.coerce                                     ?? 1,
        verbose: options?.verbose                                   ?? 0,
        file: options?.file                                         ?? 'inherit',
        encoding: options?.encoding                                 ?? 'utf-8',
        override: options?.override                                 === false ? false : true
    }

    log.settings(JSON.stringify(settings, null, 2))




    //$ { file: '...' }
    //$ handle env file import / parsing with dotenv
    //$ override is true to allow calling envy multiple times to get 
    //& env vars from multiple files                                                                
    if(!settings.file){
        try{
            dotenv.config({override: settings.override, encoding: settings.encoding }); 
            log.main(`Option "file" set to "${settings.file}" Using default file: ".env"`)
        }catch(err){
            let ERR:any = err
            log.error(`Error running dotenv.config( ):`, err)
        }
    }else if(settings.file === 'inherit'){
        try{
            let nodeEnv = process?.env?.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env`
            let res = dotenv.config({
                override: settings.override, 
                encoding: settings.encoding, 
                path: resolve(process.cwd(), nodeEnv)
            }); 
            log.main(`Option "file" set to "inherit". Loaded "${nodeEnv}" with name "${res?.parsed?.FILE_NAME}"`)
        }catch(err){
            let ERR:any = err
            log.error(`Error running dotenv.config( ):`, err)
        }
    }else{
        try{
            dotenv.config({ path: settings.file, override: settings.override, encoding: settings.encoding })
            log.main(`Using custom file: "${settings.file}" - File name: ${process?.env.FILE_NAME}`)
        }catch(err){
            let ERR:any = err
            log.error(`Error running dotenv.config():`, err)
        }
    }




    if(typeof config === 'undefined' && typeof options === 'undefined'){
        log.main('Malformed or missing config / options. Returning process.env object')
        return process?.env ?? {}
    } 

    if(config == null){
        config = ''
    }


    //$ attempt to convert json-like objects / strings to real json objects
    //& when coercing types                                                                         
    const toJSONString = (input:string) => {
        const keyMatcher = `([^",{}\\s]+?)`;
        const valMatcher = '(.,*)';
        const matcher = new RegExp(`${keyMatcher}\\s*:\\s*${valMatcher}`, 'g');
        const parser = (match:any, key:any, value:any) => `"${key}":${value}`
        return input.replace(matcher, parser);
    }
    
    //& check if a value is not undefined                                                           
    const defined = (thing:any) => typeof thing !== 'undefined'

    //& Output an error log as an error block                                                       
    let throwError = (...msg:string[]) => {
        log.error(msg.join('\n'))
        if(settings.verbose === Verbose.DISABLED){
            return;
        }else if(settings.verbose === Verbose.ENABLED){
            console.log(clr.red + '-'.repeat(100))
            console.log(clr.bright + '| ENVY ERROR:')
            msg.forEach(m => console.log(clr.reset + clr.red + '| ' + clr.yellow + m))
            console.log(clr.red + '-'.repeat(100) + clr.reset)
        }else if(settings.verbose === Verbose.THROW){
            throw new Error('\n\t'+msg.join('\n\t'))
        }
    }
    
    //& create a returnable object                                                                  
    const returnable:any = {}

    //& list of available types to compare against                                                  
    const availTypes = [
        'string',
        'number',
        // 'float',
        'array',
        'object',
        'boolean'
    ]

    //& Simple util to set keyvals on the returnable object
    const setReturnable = (k:string, v:any) => {
        log.set(`Setting "${k}" = "${v}" <${typeof v}>`)
        returnable[k] = v
    }
     










    //& Coerce variable types to the specified type                                                 
    const coerceTypes = (ITEM:EnvyParseItem) => {

        log.coerce(`\n>>>>>>>>>> coercing`)

        //$ set returnable diectly if coercion disabled
        if(typeof settings.coerce === 'number' && settings.coerce < 1 && !settings.globalType){
            log.coerce(`Coercion disabled and no global type. Setting val directly`)
            setReturnable(ITEM.objKey, ITEM.raw)
            return;
        }

        //$ Require key to be defined
        if( !defined(ITEM.key) ){
            throwError('Envy config objects must contain "key" of env variable')
            return
        }
        
        //$ make sure correct types are used
        if(typeof ITEM.type === 'string' && !availTypes.includes(ITEM.type)){
            throwError(`Type "${ITEM.type}" does not exist in types: ${availTypes.join(' | ')}`)
        }

        //$ check for default/type mismatch
        if(typeof ITEM.default === 'string' && typeof ITEM.type && typeof ITEM.default !== ITEM.type){
            log.parse({
                text: 'Type mismatch',
                ...ITEM,
                type_default: typeof ITEM.default,
            })
            throwError('The default value should match type definition', `${ITEM.key} : ${ITEM.default} <${typeof ITEM.default}> !== <${ITEM.type}> `)
        }

        //$ grab the default if no value was found, or throw if no default or value
        if(!defined(ITEM.raw)){
            log.parse(`Raw value not defined, using default`)
            if(defined(ITEM.default)){
                log.parse(`ITEM object:`, ITEM)
                // coerceTypes(ITEM.key, ITEM.default)
                ITEM.raw = ITEM.default
                //@ts-ignore
                ITEM.type = typeof ITEM.default
            }else{
                log.parse(`Default and raw value not defined`)
                throwError(`No value defined for "${ITEM.key}" : "${settings.prefix ? ITEM.key.replace(settings.prefix, '') : ITEM.key}"  ${settings.prefix ? `Using prefix "${settings.prefix}"` : ''}`)
            }
        }

        //$ auto-coerce if enabled
        if(settings.coerce === 2 && ITEM.raw){
            log.coerce(`Attempting auto-coercion`)
            if(/^-?[0-9,\._]+$/.test(ITEM.raw) && (ITEM.raw.match(/\./g)?.length ?? 0) <= 1) ITEM.type = Coerce.NUMBER
            else if(ITEM.raw.startsWith('"{') && ITEM.raw.endsWith('}"')) ITEM.type = Coerce.OBJECT
            else if(!(ITEM.raw.startsWith('"{') || ITEM.raw.startsWith('{"')) && (ITEM.raw.match(/,/g)?.length ?? 0) > 1) ITEM.type = Coerce.ARRAY
            else if(ITEM.raw.toLowerCase() === 'true' || ITEM.raw.toLowerCase() === 'false') ITEM.type = Coerce.BOOLEAN
            else ITEM.type = Coerce.STRING
        }

        //$ log conversion methods / values
        if(ITEM.type !== 'string' && ITEM.type !== typeof ITEM.raw){
            log.coerce(`Coercing "${ITEM.objKey}" : ${ITEM.raw} | <${typeof ITEM.raw}> to <${ITEM.type}>`)
        }

        //$ handle numbers                                                                          
        if(ITEM.type.startsWith('n') || ITEM.type.startsWith('i') || settings.globalType.startsWith('n') || settings.globalType.startsWith('i')){

            // remove js comma notation from strings
            if(typeof ITEM.raw === 'string'){
                ITEM.raw = ITEM.raw
                    .replace(/_/g, '')
                    .replace(/,/g, '')

                ITEM.raw = ITEM.raw.includes('.')
                            ? parseFloat(ITEM.raw)
                            : Number.isNaN(ITEM.raw) 
                                ? parseInt(ITEM.raw)
                                : Number(ITEM.raw) 
            }

            setReturnable(ITEM.objKey, ITEM.raw)
        }

        //$ handle objects                                                                          
        else if(settings.globalType.startsWith('o') || ITEM.type.startsWith('o')){
            let res = null
            // console.log("PARSING OBJECT STRING:", JSON.parse(ITEM.raw))
            try{
                res = JSON.parse( toJSONString( ITEM.raw ) )
                setReturnable(ITEM.objKey, res)
            }catch(err1){ 
                try{
                    res = JSON.parse( ITEM.raw )
                    setReturnable(ITEM.objKey, res)

                }catch(err2){
                    throwError(`Value for "${ITEM.objKey}"${ITEM.key ? ` @ "${ITEM.key}"` : ''} could not be converted to json. Keeping original value as type <string>`)
                    setReturnable(ITEM.objKey, ITEM.raw)
                }
            }
        }

        //$ handle arrays                                                                           
        else if(settings.globalType.startsWith('a') || ITEM.type.startsWith('a')){
            setReturnable(ITEM.objKey, ITEM.raw.split(',').map((x:any) => x.trim()))
        }

        //$ handle booleans                                                                         
        else if(settings.globalType.startsWith('b') || ITEM.type.startsWith('b')){
            let b = false
            let v = ITEM?.raw?.trim()?.toLowerCase()

            if(
                parseInt(v) > 0
                || parseFloat(v) > 0
                || v === 'true'
            ){
                b = true
            }
            
            setReturnable(ITEM.objKey, b)
        }
        
        //$ handle strings (default)                                                                
        else{
            setReturnable(ITEM.objKey, ITEM.raw)
        }

    }

    
























    //$ parse an individual config keyval for inferred type, defaults
    //& missing keus and prefix matching                                                            
    const parseEnvyItem = (envyItem: EnvyParseConfig) => {

        const { _key, _val, _replace, _isEnv } = envyItem

        log.parse(`\n>>>>>>>>>> parsing`, envyItem)

        let ITEM:EnvyParseItem = {
            objKey: '',
            key: '',
            raw: undefined,
            default: undefined,
            type: Coerce.STRING
        }

        if(_isEnv){
            log.parse(`Parsing as direct process.env val`)
            
            if(_replace){
                ITEM.objKey = _key.replace(_replace, '')
            }else{
                ITEM.objKey = _key
            }

            ITEM.key = _key
            ITEM.raw = _val
            ITEM.configType = 'direct'

        }
        
        else{
            
            if(settings.prefix){
                log.parse(`Using prefix:`, settings.prefix)
                ITEM.key = settings.prefix
            }
            
            if(typeof _val === 'object'){
                log.parse(`Parsing as config item (object)`)
                ITEM.key += _val.key
                ITEM.configType = 'object'
                ITEM.type = _val.type ?? typeof _val.default ?? Coerce.STRING
                ITEM.default = _val.default 
                log.parse('inferred type:', ITEM.type)
            }else{
                log.parse(`Parsing as config item (string)`)
                ITEM.key += _val
                ITEM.configType = 'string'
            }
            
            ITEM.objKey = _key
            ITEM.raw = process?.env[ITEM.key]

        }

        coerceTypes(ITEM)

    
    }





    //$ envy("PREFIX_")
    //$ parse all env var keys and add any key that matches
    //& to the returnable object                                                                    
    if(typeof config === 'string'){
        log.main(`STRING CONFIG: Matching keys with "${config}"`)
        // make sure prefix is not used when matching
        log.main(`Setting prefix to:`, config)
        settings.prefix = config
        let term:string = config

        Object.entries(process.env).forEach(([_key, _val]) => {
            if(_key.startsWith(term)){
                parseEnvyItem({ _key, _val, _replace: term, _isEnv: true})
            }   
        })
        log.main(`ENVY DONE`)
        log.return(JSON.stringify(returnable, null, 2))
        return returnable
    }


    //& Loop thru each provided keyval in the config                                                
    Object.entries(config).forEach(([_key,_val]:any) => parseEnvyItem({_key, _val}))
        

    log.main(`ENVY DONE`)
    log.return(JSON.stringify(returnable, null, 2))

    return returnable

}

export default envy
