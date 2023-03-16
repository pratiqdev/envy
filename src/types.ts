export const Verbose = {
    /** Disable logging */
    DISABLED: 0,
    /** Ensable logging */
    ENABLED: 1,
    /** Throw errors */
    THROW: 2,
} as const;
export type VerboseTypes = typeof Verbose[keyof typeof Verbose];





//&                                                                                         
export const Coerce = {
    STRING: 'string',
    NUMBER: 'number',
    ARRAY: 'array',
    OBJECT: 'object',
    BOOLEAN: 'boolean',
} as const;
export type CoerceTypes = typeof Coerce[keyof typeof Coerce];






//&                                                                                         
export const Encoding = {
    /** `utf8` UTF-8 encoding */
    UTF8: 'utf8',
    /** `ascii` ASCII encoding */
    ASCII: 'ascii',
    /** `utf16le` UTF-16 Little Endian encoding */
    UTF16LE: 'utf16le',
    /** `utf16be` UTF-16 Big Endian encoding */
    UTF16BE: 'utf16be',
    /** `utf32le` UTF-32 Little Endian encoding */
    UTF32LE: 'utf32le',
    /** `utf32be` UTF-32 Big Endian encoding */
    UTF32BE: 'utf32be',
    /** `ucs2` UCS-2 encoding */
    UCS2: 'ucs2',
    /** `iso88591` ISO-8859-1 (Latin-1) encoding */
    ISO88591: 'iso88591',
    /** `iso88592` ISO-8859-2 (Latin-2) encoding */
    ISO88592: 'iso88592',
    /** `iso88593` ISO-8859-3 (Latin-3) encoding */
    ISO88593: 'iso88593',
    /** `iso88594` ISO-8859-4 (Latin-4) encoding */
    ISO88594: 'iso88594',
    /** `iso88595` ISO-8859-5 (Cyrillic) encoding */
    ISO88595: 'iso88595',
    /** `iso88596` ISO-8859-6 (Arabic) encoding */
    ISO88596: 'iso88596',
    /** `iso88597` ISO-8859-7 (Greek) encoding */
    ISO88597: 'iso88597',
    /** `iso88598` ISO-8859-8 (Hebrew) encoding */
    ISO88598: 'iso88598',
    /** `iso88599` ISO-8859-9 (Turkish) encoding */
    ISO88599: 'iso88599',
    /** `iso885910` ISO-8859-10 (Nordic) encoding */
    ISO885910: 'iso885910',
    /** `iso885913` ISO-8859-13 (Baltic Rim) encoding */
    ISO885913: 'iso885913',
    /** `iso885915` ISO-8859-15 */
    ISO885915: 'iso885915'
 } as const;
export type EncodingTypes = typeof Encoding[keyof typeof Encoding];






//&                                                                                         
export type EnvyOptions = {

    /** Global type for automatic type coercion */
    type?: CoerceTypes;
    
    /** Find and parse keys with prefix and return keys with prefix removed
     * @example
     * prefix: "AUTH_" 
     * // finds keys "AUTH_KEY" / "AUTH_ID"
     * // removes "AUTH_" => "KEY" / "ID"
     * // returns { KEY: 'abcd', ID: 1234 }
    */
    prefix?: string;
    
    /** Enable automatic type coercion to the provided or default types */
    coerce?: boolean;
    
    verbose?: VerboseTypes;
    
    /** Root relative file path to your .env file.
     * 
     * @example
     * file ".env.abc" uses ".env.abc"
     * file "inherit" uses "env.{NODE_ENV}" = "env.development"
    */
    file?: string;

    /** Override any environment variables that have already been set on your machine with values from your .env file. */
    override?: boolean;

    encoding?: EncodingTypes
}

/** Config object for individual envy item */
export type EnvyConfigItem = {
    key: string;
    type?: CoerceTypes;
    default?: CoerceTypes;
}

/** Key of envy config tuples */
export type EnvyConfigTupleKey = string

/** Value of envy config tuples */
export type EnvyConfigTupleValue = EnvyConfigItem | string | null

/** Tuples used in the envy config object */
export type EnvyConfig = null | string | { [key:EnvyConfigTupleKey]: EnvyConfigTupleValue }

/** Keys and values directly from process.env */
export type EnvyDirectObject = { [key:string]: string }

/** Possible struct of parsable item  */
export type EnvyParseConfig = {

    /** The key of the resulting object, bumpyCaps format => { userDefinedKey: 'env_key' } */
    _key: string;
    
    /** The envyConfigItem of envyConfigString key  
     * EnvyConfigTuple: { userDefinedKey: 'ENV_KEY' }
     * EnvyConfigTuple: { userDefinedKey: { key: 'ENV_KEY', type: 'number' } }
     * EnvyDirectObject: { ENV_KEY: 'raw-value'}
     */
    _val?: any;

    /** A string to replace - usually the prefix for the full key */
    _replace?: string;

    /** Trigger alt behavior if EnvyDirectObject */
    _isEnv?:boolean;
}

export type EnvyParseItem = {
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
    type: CoerceTypes;
    default?: CoerceTypes;
}
