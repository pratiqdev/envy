import clr from './colors.js'
import dotenv from 'dotenv'
import debug from 'debug'
import fs from 'fs'

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

// debug.enable('envy:*')

export enum E_EnvyVerboseLevels {
    DISABLED = 0,
    ENABLED = 1,
    THROW = 2
} 

export enum E_EnvyConfigItemTypes {
    STRING = 'string',
    NUMBER = 'number',
    ARRAY = 'array',
    OBJECT = 'object',
    BOOLEAN = 'boolean',
}

export enum E_EncodingTypes {
    'ascii',    // For 7-bit ASCII data only. This encoding is fast and will strip the high bit if set.
    'utf8',     // Multibyte encoded Unicode characters. Many web pages and other document formats use UTF-8.
    'utf16le',  // 2 or 4 bytes, little-endian encoded Unicode characters. Surrogate pairs (U+10000 to U+10FFFF) are supported.
    'ucs2',     // Alias of 'utf16le'.
    'base64',   // Base64 encoding. When creating a Buffer from a string, this encoding will also correctly accept "URL and Filename Safe Alphabet" as specified in RFC4648, Section 5.
    'latin1',   // A way of encoding the Buffer into a one-byte encoded string (as defined by the IANA in RFC1345, page 63, to be the Latin-1 supplement block and C0/C1 control codes).
    'binary',   // Alias for 'latin1'.
    'hex',      // Encode each byte as two hexadecimal characters.
}

export type T_EnvyConfigItem = string | {
    key: string;
    type?: E_EnvyConfigItemTypes
}


export type T_EnvyOptions = {

    /** Apply type coercion to all variables */
    type?: E_EnvyConfigItemTypes;
    
    // autoCoerce?: boolean;
    
    /** Append a prefix to all env variable keys when searching
     * @example
     * prefix: "AUTH_" => { key: "API_KEY" } => process.env["AUTH_ENV_KEY"] => envy.API_KEY
    */
    prefix?: string;
    
    /** Coerce value types to the provided type */
    //- Should change this to coerce: 0/disable - 1/explicit - 2/implicit
    coerce?: 0 | 1 | 2;
    
    verbose?: E_EnvyVerboseLevels;
    
        /** Select a specific .env file with this suffix.
         * @example
         * file: "testing" => "env.testing"
         * file: "inherit" => "env.{NODE_ENV}" => "env.production"
         */
    file?: string;

    override?: boolean;

    encoding?: string;
}
dotenv.config({encoding:''})

export type T_EnvyConfig = { [key:string]: T_EnvyConfigItem | string }





/** ε η ν ψ  
 * 
 * 
*/
const envy = (config?: string | T_EnvyConfig, options?: T_EnvyOptions) => {
    log.main('ENVY START')
    log.config(JSON.stringify(config, null, 2))
    log.options(JSON.stringify(options, null, 2))

    //& define a settings object based on config                                                    
    const settings = {
        // showWarnings: options?.showWarnings == false ? false      : true,
        globalType: options?.type                                   ?? '',
        // autoCoerce: options?.autoCoerce                             ?? false,
        
        prefix: options?.prefix                                     ?? null,
        coerce: options?.coerce                                     ?? 1,
        verbose: options?.verbose                                   ?? 0,
        // dotenv
        file: options?.file                                         ?? 'inherit',
        encoding: options?.encoding                                 ?? 'utf-8',
        override: options?.override                                 === false ? false : true
    }

    log.settings(JSON.stringify(settings, null, 2))




    //$ { file: '...' }
    //$ handle env file import / parsing with dotenv
    //$ override is true to allow calling envy multiple times to get 
    //& env vars from multiple files                                                                
    if(settings.file === 'inherit' || settings.file === ''){
        try{

            dotenv.config({override: settings.override, encoding: settings.encoding }); 
            log.main('Using default file: ".env"')
        }catch(err){
            let ERR:any = err
            log.error(`Error running dotenv.config( ):`, err)
        }
    }else if(settings.file !== ''){
        try{
            dotenv.config({ path: settings.file, override: settings.override, encoding: settings.encoding })
            log.main(`Using custom file: "${settings.file}"`)
        }catch(err){
            let ERR:any = err
            log.error(`Error running dotenv.config():`, err)
        }
    }

    fs.writeFileSync('current_process.json', JSON.stringify(process.env))



    if(typeof config === 'undefined'){
        log.main('Malformed or missing config. Returning process.env object')
        return process?.env || {}
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
        if(settings.verbose === 0){
            return;
        }else if(settings.verbose === 1){
            console.log(clr.red + '-'.repeat(100))
            console.log(clr.bright + '| ENVY ERROR:')
            msg.forEach(m => console.log(clr.reset + clr.red + '| ' + clr.yellow + m))
            console.log(clr.red + '-'.repeat(100) + clr.reset)
        }else if(settings.verbose === 2){
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
    let coerceTypes = (_key:string, _val:any) => {
        // const {key, fullKey, raw } = _val
        log.coerce(`\n>>>>> coercing | key: ${_key} | val: ${_val.raw}`)


        if(settings.coerce < 1 && !settings.globalType){
            log.coerce(`Coercion disabled and no global type. Setting val directly`)
            setReturnable(_key, _val.raw)
            return;
        }

        let inferredType 
        // = _val?.type?.toLowerCase() || typeof _val?.default || 'string'

        if(defined(_val.type)){
            inferredType = _val.type.toLowerCase()
        }else if(defined(_val.default)){
            inferredType = typeof _val.default
        }else{
            inferredType = 'string'
        }

        log.coerce(`_val.type: ${_val.type}`)
        log.coerce(`typeof _val.default: ${typeof _val.default}`)

        if(settings.coerce === 2 && _val.raw){
            log.coerce(`Attempting auto-coercion`)
            if(/^-?[0-9,\._]+$/.test(_val.raw) && (_val.raw.match(/\./g)?.length ?? 0) <= 1) inferredType = 'number'
            else if(_val.raw.startsWith('"{') && _val.raw.endsWith('}"')) inferredType = 'object'
            else if(!(_val.raw.startsWith('"{') || _val.raw.startsWith('{"')) && (_val.raw.match(/,/g)?.length ?? 0) > 1) inferredType = 'array'
            else if(_val.raw.toLowerCase() === 'true' || _val.raw.toLowerCase() === 'false') inferredType = 'boolean'
            else inferredType = 'string'
        }

        log.coerce(`Inferred type: ${inferredType}`)


        if(settings.globalType){
            log.coerce(`Enforcing global type: ${settings.globalType}`)
        }

        inferredType !== typeof _val.raw
            ? log.coerce(`Coercing "${_key}" : ${_val.raw} | <${typeof _val.raw}> to <${inferredType}>`)
            : log.coerce(`Coercing "${_key}" : ${_val.raw} | <${typeof _val.raw}>  (skipping)`)
        

        //& handle numbers                                                                          
        if(inferredType.startsWith('n') || inferredType.startsWith('i') || settings.globalType.startsWith('n') || settings.globalType.startsWith('i')){

            // remove js comma notation from strings
            if(typeof _val.raw === 'string'){
                _val.raw = _val.raw
                    .replace(/_/g, '')
                    .replace(/,/g, '')

                _val.raw = _val.raw.includes('.')
                            ? parseFloat(_val.raw)
                            : Number(_val.raw) !== NaN 
                                ? Number(_val.raw) 
                                : parseInt(_val.raw)
            }

            setReturnable(_key, _val.raw)
        }

        //& handle objects                                                                          
        else if(settings.globalType.startsWith('o') || inferredType.startsWith('o')){
            let res = null
            // console.log("PARSING OBJECT STRING:", JSON.parse(_val.raw))
            try{
                res = JSON.parse( toJSONString( _val.raw ) )
                setReturnable(_key, res)
            }catch(err1){ 
                try{
                    res = JSON.parse( _val.raw )
                    setReturnable(_key, res)

                }catch(err2){
                    throwError(`Value for "${_key}"${_val.fullKey ? ` @ "${_val.fullKey}"` : ''} could not be converted to json. Keeping original value as type <string>`)
                    setReturnable(_key, _val.raw)
                }
            }
        }
        //& handle arrays                                                                           
        else if(settings.globalType.startsWith('a') || inferredType.startsWith('a')){
            setReturnable(_key, _val.raw.split(',').map((x:any) => x.trim()))
        }

        //& handle booleans                                                                         
        else if(settings.globalType.startsWith('b') || inferredType.startsWith('b')){
            let b = false
            let v = _val?.raw?.trim()?.toLowerCase()

            if(
                parseInt(v) > 0
                || parseFloat(v) > 0
                || v === 'true'
            ){
                b = true
            }
            
            setReturnable(_key, b)
        }
        
        //& handle strings (default)                                                                
        else{
            setReturnable(_key, _val.raw)
        }

   
    }



    //$ parse an individual config keyval for inferred type, defaults
    //& missing keus and prefix matching                                                            
    const parseEnvyItem = (_key:string, _val:any, replaceTerm?: string) => {
        // console.log('parsing envy item:', {_key, _val})
        let KEY = _key
        let VAL = _val
        let VAL_OBJ:any = {}
        
        log.parse(`\n>>>>> parsing  \n\tkey: ${_key}  \n\tval: ${_val}  \n\treplace: ${replaceTerm}`)

        // convert basic tuple envy items to full envy items
        if(typeof _val === 'string'){
            log.parse(`Value was string, creating full env item from: \n\tkey: ${_key} \n\tval:${_val} \n\treplace:${replaceTerm}`)
            VAL_OBJ = {
                key: _val
            }
        }
        
        // replace the search term if the callee specifies one
        if(replaceTerm){
            let newKey = _key.replace(replaceTerm, '')
            log.parse(`Replacing term: \n\t${_key} => ${newKey}`)
            VAL_OBJ.key = newKey
        }
        
        log.parse(`New value object: \n\t`, _val)


        // envy items require a key - throw an error
        if(!defined(_val.key) || _val.key === ''){
            log.parse('Envy config objects must contain "key" of env variable')
            throwError('Envy config objects must contain "key" of env variable')
            return
        }

        // make sure correct types are used
        if(defined(_val.type) && !availTypes.includes(_val.type)){
            log.parse(`Type "${_val.type}" does not exist in types: ${availTypes.join(' | ')}`)
            throwError(`Type "${_val.type}" does not exist in types: ${availTypes.join(' | ')}`)
        }

        // check for default/type mismatch
        if(defined(_val.default) && defined(_val.type) && typeof _val.default !== _val.type){
            log.parse({
                text: 'Type mismatch',
                ..._val,
                type_default: typeof _val.default,
            })
            throwError('The default value should match type definition', `${_key} : ${_val.default} <${typeof _val.default}> !== <${_val.type}> `)
        }

        // assemble the full env key
        let fullKey = settings.prefix && !_val.key.includes(settings.prefix)
                        ? _val.key 
                            ? settings.prefix + _val.key 
                            : settings.prefix + _key 
                        : _val.key 
                            ? _val.key 
                            : _key

        // assign the full key to envy item and grab env var
        _val.fullKey = fullKey
        _val.raw = process?.env[fullKey]

        log.parse(`Key: ${_val.key}, Prefix: ${settings.prefix}, Full: ${fullKey}`)

        // grab the default if no value was found, or throw if no default or value
        if(!defined(_val.raw)){
            log.parse(`Raw value not defined, using default`)
            if(defined(_val.default)){
                log.parse(`_val object:`, _val)
                coerceTypes(_val.key, _val.default)
            }else{
                log.parse(`Default and raw value not defined`)
                throwError(`No value defined for "${_key}" : "${settings.prefix ? _val.key.replace(settings.prefix, '') : _val.key}"  ${settings.prefix ? `Using prefix "${settings.prefix}"` : ''}`)
            }
        }
        // pass on to coerce types if value was found
        else{
            log.parse(`Found raw value.`)
            log.parse(`coercing value of key: ${_val.key} | val:`, _val)
            log.parse(`_val object:`, _val)
            coerceTypes(_val.key, _val)
        }


    
        
    
    
    }





    //$ envy("PREFIX_")
    //$ parse all env var keys and add any key that matches
    //& to the returnable object                                                                    
    if(typeof config === 'string'){
        log.main(`String config: Matching keys with "${config}"`)
        // make sure prefix is not used when matching
        settings.prefix = config
        let term:string = config

        Object.entries(process.env).forEach(([_key, _val]) => {
            if(_key.startsWith(term)){
                parseEnvyItem(_key, _val ?? '', term)
            }   
        })
        log.main(`ENVY DONE`)
        log.return(JSON.stringify(returnable, null, 2))
        return returnable
    }


    //& Loop thru each provided keyval in the config                                                
    Object.entries(config).forEach(keyval => {
        if(typeof keyval[1] === 'string'){
            // let fullKey = settings.prefix ? settings.prefix + keyval[1] : keyval[1]
            // let val = process?.env[fullKey]
            // if(!val){
                // throwError(`No env value found for "${keyval[0]}" | ${keyval[1]} | ${fullKey}`)
            // }
            // log.main(`Env value found: \n\t kv0:"${keyval[0]}" \n\t kv1: ${keyval[1]} \n\t fullkey:${fullKey}`)
            // setReturnable(keyval[0], val)
            parseEnvyItem(...keyval)
        }else{
            parseEnvyItem(...keyval)
        }
    })
        

    log.main(`ENVY DONE`)
    log.return(JSON.stringify(returnable, null, 2))
    return returnable


}

export default envy
