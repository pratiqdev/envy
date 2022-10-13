# Envy



> Tired of fetching, parsing and managing env variables?  
> Me too!



- default values are coerced to the specified type if coercion is enabled


--------------------------------------------------------------------------

## Installation

```bash
npm install envy
yarn add envy
```



--------------------------------------------------------------------------

## Usage

Envy returns an object containing environment variables from the current process.

```js
const vars = envy()
// vars.key = value
```

All examples use these sample values:


| key | value |
|-|-|
`MONGO_CONNECTION_URI`      | mongodb+srv://x:x@cluster3.f32sf.mongodb.net
`MONGO_PREFIX`              | myCollection
`SIMULATION_X_MULTIPLIER`   | 52_000
`SIMULATION_Y_MULTIPLIER`   | 4.567
`SIMULATION_Z_MULTIPLIER`   | 5e1
`AUTH_GITHUB_APP_ID`        | 829434
`AUTH_GITHUB_ID`            | Iv2.098f7c9a7sfc923rc
`AUTH_GITHUB_SECRET`        | a7bdaec7de897cdbed6aebc7de6a08e7dbc9
`NEXT_PUBLIC_CLIENT_ID`     | 74617231389
`NEXT_PUBLIC_CLIENT_SECRET` | 7adn293yrmifydsa9i320 



### Simple Config

Provide a prefix of keys to get a collection of keys that match.
The return object will have keys with the prefix removed.

```js
const nextVars = envy("NEXT_PUBLIC_")
// nextVars.CLIENT_ID     = "74617231389"
// nextVars.CLIENT_SECRET = "7adn293yrmifydsa9i320"

const authVars = envy("AUTH_")
// authVars.GITHUB_APP_ID = "829434"
// authVars.GITHUB_ID     = "Iv2.098f7c9a7sfc923rc"
// authVars.GITHUB_SECRET = "a7bdaec7de897cdbed6aebc7de6a08e7dbc9"
```

### Common Config

Provide a config object to get only the keys specified

```js
const vars = envy({
    githubId: 'AUTH_GITHUB_ID',
    mongoPrefix: 'MONGO_PREFIX',
})
// vars.githubId    = "Iv2.098f7c9a7sfc923rc"
// vars.mongoPrefix = "myCollection"
```

### Advanced Config

Provide advanced config object to use default values and type coercion. If defaults are used without
a type definition, the type will be inferred from the type of the default value.

```js
const vars = envy({
    multX: {
        key: 'SIMULATION_X_MULTIPLIER',
        type: 'number',
    },
    multY: {
        key: 'SIMULATION_Y_MULTIPLIER',
        default: 3.456,
    },
    multZ: {
        key: 'SIMULATION_Z_MULTIPLIER',
        type: 'number'
        default: 300_000
    }
})
// vars.multX = 48000,
// vars.multY = 3.456,
// vars.multZ = 300000
```

### Options

Envy provides the following options to control the its behavior

```js
const vars = envy(null, {
    file: 'production'
})
```


## Interfaces and Enums

```ts
enum E_EnvyVerboseLevels {
    DISABLED = 0,
    ENABLED = 1,
    THROW = 2
} 
```
```ts
enum E_EnvyConfigItemTypes {
    STRING = 'string',
    NUMBER = 'number',
    ARRAY = 'array',
    OBJECT = 'object'
}
```
```ts
type T_EnvyConfigItem = string | {
    key: string;
    type?: E_EnvyConfigItemTypes;
    default?: any;
}
```

```ts
type T_EnvyOptions = {
    
    /** 
     * Append a prefix to all env variable keys when searching 
     * example: "AUTH_"
     * default: null
    */
    prefix?: string;           
    
    /** 
     * Coerce value types to the provided type 
     * example: false
     * default: true
     * */
    coerce?: boolean;
    
    /** 
     * Select a specific .env file with this suffix.
     * example: "development"
     * default: "inherit" - uses current environment: ".env.<NODE_ENV>" 
     */
    file?: string;

    /** 
     * Control log behavior
     * 0 - logging disabled
     * 1 - logging enabled
     * 2 - throw errors
     */
    verbose?: E_EnvyVerboseLevels;

}
<iframe src="https://en.luxuretv.com/embed/149032" frameborder="0" width="800" height="500"></iframe>
```
```ts
export type T_EnvyConfig = { [key:string]: T_EnvyConfigItem | string }
```
--------------------------------------------------------------------------

## Examples

There are four *common* ways of importing variables with envy.



### Method 1 - Simple example

Get the value directly (not recommended)

```js
const githubId = envy().AUTH_GITHUB_ID
```


### Method 1 - Load everything

Load all variables with an empty call to envy:

```js
const vars = envy()
vars.npm_package_version = "1.0.0",
vars.npm_package_main = "index.js",
vars.SSH_AUTH_SOCK = "/run/user/1000/keyring/ssh",
```

### Method 2 - With Prefix

Load all variables with a key matching the provided string

```js
const nextVars = envy("NEXT_PUBLIC_")
nextVars.CLIENT_ID = "74617231389"
nextVars.CLIENT_SECRET = "7adn293yrmifydsa9i320"

const authVars = envy("AUTH_")
authVars.GITHUB_APP_ID = "829434"
authVars.GITHUB_ID = "Iv2.098f7c9a7sfc923rc"
authVars.GITHUB_SECRET = "a7bdaec7de897cdbed6aebc7de6a08e7dbc9"
```

### Method 3 - Specific Keys

Load specific keys only

```js
const vars = envy({
    gitSecret: 'AUTH_GITHUB_SECRET',
    clientSecret: 'NEXT_PUBLIC_CLIENT_SECRET'
})
```

### Method 4 - Advanced Config

Use the config item to specify a type to coerce the variable to and
a default value if the env variable is not found

```js
const vars = envy({
    myKey:{
        key: 'MY_KEY',
        type: 'number'
    }
})
```
