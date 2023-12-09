const envy = require('./index.js')

console.log(envy({
    USE_CDN: {
        key: 'USE_CDN',
        type: 'boolean', // Set the type to boolean
        default: false, // Set a default value if needed
    },
}))