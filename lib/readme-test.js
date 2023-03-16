import envy from './dist/envy.js.js'

const vars = envy({
    multX: {
        key: 'SIMULATION_X_MULTIPLIER',
        // type: 'number',
        default: 48_000,
    },
    multY: {
        key: 'SIMULATION_Y_MULTIPLIER',
        // type: 'number',
        default: 3.456,
    },
    multZ: {
        key: 'SIMULATION_Z_MULTIPLIER',
        // type: 'number',
        default: 300_000
    }
})
console.log(vars)