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

/** Config object for individual envy item */
export type T_EnvyConfigItem = {
    key: string;
    type?: E_EnvyConfigItemTypes;
    default?: any;
}

/** Key of envy config tuples */
export type T_EnvyConfigTupleKey = string

/** Value of envy config tuples */
export type T_EnvyConfigTupleValue = T_EnvyConfigItem | string | null

/** Tuples used in the envy config object */
export type T_EnvyConfig = null | string | { [key:T_EnvyConfigTupleKey]: T_EnvyConfigTupleValue }

/** Keys and values directly from process.env */
export type T_EnvyDirectObject = { [key:string]: string }

/** Possible struct of parsable item  */
export type T_EnvyParseConfig = {

    /** The key of the resulting object, bumpyCaps format => { userDefinedKey: 'env_key' } */
    _key: string;
    
    /** The envyConfigItem of envyConfigString key  
     * T_EnvyConfigTuple: { userDefinedKey: 'ENV_KEY' }
     * T_EnvyConfigTuple: { userDefinedKey: { key: 'ENV_KEY', type: 'number' } }
     * T_EnvyDirectObject: { ENV_KEY: 'raw-value'}
     */
    _val?: any;

    /** A string to replace - usually the prefix for the full key */
    _replace?: string;

    /** Trigger alt behavior if T_EnvyDirectObject */
    _isEnv?:boolean;
}

export type T_EnvyParseItem = {
    /** Key used for returnable object */
    objKey: string;

    /** Full key assembled from prefix / key / _val.key */
    // fullKey: string;

    /** The raw value from process.env */
    raw:any;

    /** The string used to replace / concat with key */
    replace?: string | null;

    /** How this item was created in the config */
    configType?: string;

    key: string;
    type: E_EnvyConfigItemTypes;
    default?: any;
}
