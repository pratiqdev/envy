<p align="center">
  <img src="https://raw.githubusercontent.com/pratiqdev/public-images/master/envy_cat.webp" alt="envy cat" width="100%">
</p>

<p align='center'>
<img src='https://img.shields.io/badge/license_MIT-black'>
<img src='https://img.shields.io/badge/npm_1.0.9-black'>
<img src='https://img.shields.io/badge/tests_passing-black'>
</p>


<p align="center">Load, parse and manage environment variables the easy way!</p>




<br />
<br />
<br />




# **Installation**
**Install using your preferred package manager**
```bash
pnpm add @pratiq/envy
```

<br />
<br />
<br />


# **Basic Usage**

Grab the keys, trim the prefix and return and object with key-values. 

```bash
# .env.testing
MY_LONG_ASS_PREFIX_API_URL=https://my-server.xyz/my-api/
MY_LONG_ASS_PREFIX_API_KEY=1a2b3c4d5e6f
```
```js
const envy = require('@pratiq/envy')

const api = envy('MY_LONG_ASS_PREFIX_API_')
const res = fetch(`${api.URL}/restricted`, { api_key: api.KEY })
```


<br />
<br />
<br />

# **Usage Examples**




**Common usage instructions and examples**

```js
const vars = envy({
    flap: 'FLAP',
    tap: 'TX_TAP',
    myKey:{
        key: 'MY_UNIQUE_KEY',
        type: 'number',
        default: 1877
    }
}, {
    file: '.env.testing',
    prefix: 'TEST_CASE_7_',
    coerce: true,
    verbose: 2,
    override: true,
    encoding: 'utf8'
})
```


> <details>
> <summary>
> Example key-value list
> </summary>
> 
> | key | value |
> |-|-|
> `MONGO_CONNECTION_URI`      | mongodb+srv://\<user\>:\<password\>@cluster1.abcd123.mongodb.net
> `MONGO_PREFIX`              | myCollection
> `SIMULATION_X_MULTIPLIER`   | 52_000
> `SIMULATION_Y_MULTIPLIER`   | 4.567
> `SIMULATION_Z_MULTIPLIER`   | 5e1
> `AUTH_GITHUB_APP_ID`        | 827431
> `AUTH_GITHUB_ID`            | Iv2.056f7c9a5sfc923rc
> `AUTH_GITHUB_SECRET`        | a7bdaec7de897cdbed6aebc7de6a08e7dbc9
> `NEXT_PUBLIC_CLIENT_ID`     | 135
> `NEXT_PUBLIC_CLIENT_KEY`    | 74617321489
> `NEXT_PUBLIC_CLIENT_SECRET` | 7adn293yrmnefydsa9i320 
> 
> *These values are imitations of the types and values of their real value*


</details>

<br />
<br />



## **Load everything**
Load all variables from your environment into an object:
```js
const vars = envy()
// vars.npm_package_version = "1.0.0",
// vars.SSH_AUTH_SOCK = "/run/user/1000/keyring/ssh",
```
<br />




## **Load by Prefix**
Load all variables with a key matching the provided prefix string
```js
const nextVars = envy("NEXT_PUBLIC_")
// nextVars.CLIENT_ID = "74617231389"
// nextVars.CLIENT_SECRET = "7adn293yrmifydsa9i320"

const authVars = envy("AUTH_")
// authVars.GITHUB_APP_ID = "829434"
// authVars.GITHUB_ID = "Iv2.098f7c9a7sfc923rc"
```
<br />




## **Load Specific Keys**
Load specific keys only using an object of names mapped to the .env key
```js
const vars = envy({
    gitSecret: 'AUTH_GITHUB_SECRET',
    clientSecret: 'NEXT_PUBLIC_CLIENT_SECRET'
})
// vars.gitSecret    = a7bdaec7de897cdbed6aebc7de6a08e7dbc9
// vars.clientSecret = 7adn293yrmifydsa9i320
```
<br />




## **Keys and Prefix**
Load specific keys by prefix and assign them to the key they were mapped to.
```js
const vars = envy({
    id: 'ID',
    ss: 'SECRET',
}, {
    prefix: 'NEXT_PUBLIC_CLIENT_',
})
// vars.id  = 135
// vars.ss  = 7adn293yrmifydsa9i320
```
<br />




## **Default Values**
Use an object to assign additional options to a key, like default values.
```js
const vars = envy({
    myKey:{
        key: 'MY_KEY',
        default: 1877
    },
    blap:{
        key: 'BIG_BLAP',
        default: 9423
    }
})
// vars.myKey = 123456
// vars.blap  = 9423
```
<br />





## **Coerce Keys**
Use the config item to specify a type to coerce the variable to and
a default value if the env variable is not found. This key will attempt to use the inferred type from the default if no type property is provided.
```js
const vars = envy({
    myKey:{
        key: 'MY_KEY',
        type: 'number',
        default: 1877
    }
})
```
<br />
<br />
<br />









# **Options**
**Envy provides the following options to control its behavior or alter the output.**
<br />
<br />

## **File**
Provide a path to the file to load or inherit from the current environment
```js
const vars = envy({ file: '.env.testing' })
const vars = envy({ file: 'inherit' }) // default, same as:
const vars = envy()
```
Many hosting platforms and frameworks set the `NODE_ENV` variable when starting the process, which 
is useful for determining which .env file to load. Vercel for example sets this value to 'development',
'preview' or 'production' depending on the target environment.  

Starting the node process with the `NODE_ENV` variable set will load the .env 
file with the respective name, for example:

```bash
$ NODE_ENV = testing      # ".env.testing"
$ NODE_ENV = development  # ".env.development"
```
<br />


## **Prefix**
Load and parse keys that include the prefix, then remove the prefix from the keys.
```js
const vars = envy({}, { prefix: 'NEXT_PUBLIC_CLIENT_' })
```
The string prefix, if provided to envy as the first argument, will override options.prefix
```js
const vars = envy('OOPS_', { prefix: 'NEXT_PUBLIC_CLIENT_' }) // => "OOPS_..."
```
<br />


## **Encoding**
Load and parse .env files that use encoding other than `utf8` - the default. Envy automatically 
attempts to convert from the provided encoding to `utf-8`, or you can define what encoding it should use.
```js
const vars = envy({ encoding: 'base64' })
```
<br />


## **Verbose**
Set envy to log or throw errors when an error is encountered during .env loading or parsing.
```js
const vars = envy({
    verbose: 0, 
    // 0 disabled
    // 1 enabled
    // 2 throw errors
})
```
<br />




## **Coerce**
Enable global type coercion to the provided type, or enable automatic type coercion. All values will 
be coerced to this value, unless config provides items with their own type, or if global coerce is 
set to 0 (disabled).

- 0: No type coercion
- 1: Strict type coercion
- 2: Inferred type coercion

```js
const vars = envy({
    age: 'TOKEN_AGE',       // coerced to inferred type
    expires: 'TOKEN_EXP',   // coerced to inderred type
    name: {
        key: 'TOKEN_NAME',  // string (not coerced)
        type: 'string',
    }
}, { 
    coerce: 2,
})
```
<br />




## **Type**
Provide a type to coerce all values to, if coerce is set at or above 1, or if config items 
provide a custom type.

Avalable types are `string`, `number`, `boolean`, `array` and `object`.
```js
const vars = envy({
    age: 'TOKEN_AGE',       // coerced to number
    expires: 'TOKEN_EXP',   // coerced to number
    name: {
        key: 'TOKEN_NAME',  // string (not coerced)
        type: 'string',
    }
}, { 
    coerce: 1,
    type: 'number'
})
```

<br />
<br />
<br />





# Types / Interfaces


## Override Patterns

The following overrides are considered valid usage:
```js
envy()
envy('prefix')
envy({ config })
envy(null, { options })
envy({}, { options })
envy('prefix', { options }) 
envy({ config }, { options })
envy({ options })
```

The most common overrides are string prefix, or config object:
```js
envy('prefix_')
envy({
    prefix: 'prefix_',
    file: 'inherit',
    coerce: 2,
})
```
<br />

## Type Definitions


### EnvyOptions
```ts
export type EnvyOptions = {

    // Global type for automatic type coercion
    type?: CoerceTypes;
    
    // Find and parse keys with prefix and return keys 
    // with prefix removed
    prefix?: string;
    
    // Enable automatic type coercion to the provided or 
    // inferred types
    coerce?: 0 | 1 | 2;
    
    // Enable logging / throwing errors
    verbose?: VerboseTypes;
    
    // Path to your .env file relative to the projects root.
    file?: string;

    // Override any environment variables that have already 
    // been set on your machine with values from your .env file. 
    override?: boolean;

    // Load and parse .env files with alternative encodings
    encoding?: EncodingTypes
}
```


### ConfigItem
Key parsing definitions used in the envy config.
```ts
export type EnvyConfigItem = {
    // The key to match and parse
    key: string;
    // The type for coercion
    type?: CoerceTypes;
    // The default value if no key found
    default?: string;
}
```


### CoerceTypes 
```ts
export const Coerce = {
    STRING: 'string',
    NUMBER: 'number',
    ARRAY: 'array',
    OBJECT: 'object',
    BOOLEAN: 'boolean',
} as const;
export type CoerceTypes = typeof Coerce[keyof typeof Coerce];
```


### VerboseTypes 
```ts
export const Verbose = {
    DISABLED: 0,
    ENABLED: 1,
    THROW: 2,
} as const;
export type VerboseTypes = typeof Verbose[keyof typeof Verbose];
```



### EncodingTypes 
```ts
export const Encoding = {
    UTF8: 'utf8',
    UCS2: 'ucs2',
    ASCII: 'ascii',
    UTF16LE: 'utf16le',
    UTF16BE: 'utf16be',
    UTF32LE: 'utf32le',
    UTF32BE: 'utf32be',
    ISO88591: 'iso88591',
    ISO88592: 'iso88592',
    ISO88593: 'iso88593',
    ISO88594: 'iso88594',
    ISO88595: 'iso88595',
    ISO88596: 'iso88596',
    ISO88597: 'iso88597',
    ISO88598: 'iso88598',
    ISO88599: 'iso88599',
    ISO885910: 'iso885910',
    ISO885913: 'iso885913',
    ISO885915: 'iso885915'
 } as const;
export type EncodingTypes = typeof Encoding[keyof typeof Encoding];
```