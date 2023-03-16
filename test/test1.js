import assert from 'assert'
import envy from '../dist/main.js'
import { expect } from 'chai';


const heading = (text) => `${text}\n  ${'-'.repeat(text.length)}`

describe(heading('A | Option testing'), () => {

    // beforeEach(()=>{
    //   console.log('Current environment:', process.env.NODE_ENV)
    // })

    it('A.1  | Should export a default function.', () => {
        assert(typeof envy === 'function')
    });

    it('A.2  | Should return complete env with no config/options.', () => {
      const ENVY = envy()
      expect(Object.entries(ENVY).length).to.be.greaterThan(0)
    });

    it('A.3  | Should return complete env with null config.', () => {
      const ENVY = envy(null, { file: '.env.match'})
      expect(Object.entries(ENVY).length).to.be.greaterThan(100)
    });

    it('A.4  | { verbose: 0 } Should show no warnings if disabled.', () => {

      expect(
        () => envy({
          file: 'PREF_ENV_NAME',
          a: {
            key: 'EMPTY_KEY',
            default: '123',
            type: 'number',
          },
        }, { verbose: 0 })
      ).to.not.throw()

      // console.log( envy({
      //   file: 'PREF_ENV_NAME',
      //   a: {
      //     key: 'EMPTY_KEY',
      //     default: '123',
      //     type: 'number',
      //   },
      // }, { verbose: 0 }))
    
    });

    it('A.5  | { verbose: 1 } Should warn user about default / type mismatch.', () => {

      expect(
        () => envy({
          file: 'PREF_ENV_NAME',
          a: {
            key: 'EMPTY_KEY',
            default: '123',
            type: 'number',
          },
        })
      ).to.not.throw()
    
    });

    it('A.6  | { verbose: 2 } Should throw error.', () => {

      expect(
        () => envy({
          a: {
            key: 'EMPTY_KEY',
            default: '123',
            type: 'number',
          },
        }, {
          verbose: 2
        })
      ).to.throw()
    })

    it('A.7  | { prefix: "..." } Should return keys matching prefix.', () => {
      const ENVY = envy({
        key: 'KEY',
        age: 'AGE',
        expires: 'EXP'
      }, {
        prefix: 'NEXT_PUBLIC_CLIENT_',
        file: 'inherit'
      })

      
      // console.log(ENVY)

      expect(ENVY.key).to.eq('the-key')
      expect(ENVY.age).to.eq('key-age')
      expect(ENVY.expires).to.eq('key-expires')
      
    });

    it('A.8  | { file: "..." } Should return env from specified file.', () => {
      const ENVY_1 = envy('SNAP_', { file: '.env.development' })
      // const ENVY_2 = envy('PREF_', {file: '.env.production'})
      // const ENVY_3 = envy('PREF_', {file: '.env.testing'})

      // console.log(ENVY_1)
      // console.log('-'.repeat(80))
      // console.log(process.env)

      expect(Object.entries(ENVY_1).length).to.be.greaterThan(0)
      // expect(Object.entries(ENVY_2).length).to.be.greaterThan(0)
      // expect(Object.entries(ENVY_3).length).to.be.greaterThan(0)
      
      // expect(ENVY_1.ENV_NAME).to.equal('DEVELOPMENT')
      // expect(ENVY_2.ENV_NAME).to.equal('PRODUCTION')
      // expect(ENVY_3.ENV_NAME).to.equal('TESTING')
    });

    it('A.9  | { coerce: 0 } Should disable type coercion.', () => {
      const ENVY_1 = envy({
        name: {
          key: 'BLAP_ONE',
          type: 'number'
        }
      }, { 
        coerce: 0,
        file: '.env.testing'
       })

      expect(ENVY_1.name).to.equal('1')
    });

    it('A.10 | { override: false } Should disable env override.', () => {
      /*
        Override set to false should prevent new calls to envy from overriding previously set values
        May/should be used when calling envy multilpe times within the same running process
      */
      const ENVY_1 = envy('PREF_', {file: '.env.development'})
      // const ENVY_2 = envy('PREF_', {file: '.env.production'})
      // const ENVY_3 = envy('PREF_', {file: '.env.testing', override: false })
      // const ENVY_4 = envy('PREF_', {file: '.env.local', override: true })

      expect(Object.entries(ENVY_1).length).to.be.greaterThan(0)
      // expect(Object.entries(ENVY_2).length).to.be.greaterThan(0)
      // expect(Object.entries(ENVY_3).length).to.be.greaterThan(0)
      // expect(Object.entries(ENVY_4).length).to.be.greaterThan(0)

      // console.log(ENVY_1)
      
      expect(ENVY_1.ENV_NAME).to.equal('DEVELOPMENT')
      // expect(ENVY_2.ENV_NAME).to.equal('PRODUCTION')
      // expect(ENVY_3.ENV_NAME).to.equal('PRODUCTION')
      // expect(ENVY_4.ENV_NAME).to.equal('LOCAL')
    });

    it('A.11 | { type: "..." } Should match global type definition.', () => {
      /*
        Override set to false should prevent new calls to envy from overriding previously set values
        May/should be used when calling envy multilpe times within the same running process
      */
      assert(Object.entries(envy('BOOLEAN_', {file: '.env.match', coerce: 0}))
        .every(x => typeof x[1] === 'string'))

      assert(Object.entries(envy('BOOLEAN_', {file: '.env.match', type: 'b'}))
        .every(x => typeof x[1] === 'boolean'))
      
      assert(Object.entries(envy('BOOLEAN_', {file: '.env.match', type: 'bool'}))
        .every(x => typeof x[1] === 'boolean'))
      
      assert(Object.entries(envy('BOOLEAN_', {file: '.env.match', type: 'boolean'}))
        .every(x => typeof x[1] === 'boolean'))



      assert(Object.entries(envy('NUMBER__', {file: '.env.match', coerce: 0}))
        .every(x => typeof x[1] === 'string'))
      
      assert(Object.entries(envy('NUMBER__', {file: '.env.match', type: 'n'}))
        .every(x => typeof x[1] === 'number'))
      
      assert(Object.entries(envy('NUMBER__', {file: '.env.match', type: 'num'}))
        .every(x => typeof x[1] === 'number'))
      
      assert(Object.entries(envy('NUMBER__', {file: '.env.match', type: 'i'}))
        .every(x => typeof x[1] === 'number'))
      
      assert(Object.entries(envy('NUMBER__', {file: '.env.match', type: 'int'}))
        .every(x => typeof x[1] === 'number'))
      
      assert(Object.entries(envy('NUMBER__', {file: '.env.match', type: 'integer'}))
        .every(x => typeof x[1] === 'number'))
      
      assert(Object.entries(envy('NUMBER__', {file: '.env.match', type: 'number'}))
        .every(x => typeof x[1] === 'number'))



      assert(Object.entries(envy('OBJECT__', {file: '.env.match', coerce: 0}))
        .every(x => typeof x[1] === 'string'))

      assert(Object.entries(envy('OBJECT__', {file: '.env.match', type: 'o'}))
        .every(x => typeof x[1] === 'object' && !Array.isArray(x[1])))

      assert(Object.entries(envy('OBJECT__', {file: '.env.match', type: 'obj'}))
        .every(x => typeof x[1] === 'object' && !Array.isArray(x[1])))

      assert(Object.entries(envy('OBJECT__', {file: '.env.match', type: 'object'}))
        .every(x => typeof x[1] === 'object' && !Array.isArray(x[1])))



      assert(Object.entries(envy('ARRAY___', {file: '.env.match', coerce: 0}))
        .every(x => typeof x[1] === 'string'))

      assert(Object.entries(envy('ARRAY___', {file: '.env.match', type: 'a'}))
        .every(x => typeof x[1] === 'object' && Array.isArray(x[1])))

      assert(Object.entries(envy('ARRAY___', {file: '.env.match', type: 'arr'}))
        .every(x => typeof x[1] === 'object' && Array.isArray(x[1])))

      assert(Object.entries(envy('ARRAY___', {file: '.env.match', type: 'array'}))
        .every(x => typeof x[1] === 'object' && Array.isArray(x[1])))
      
    });

    it('A.12 | { encoding: "base64" } Should use specified encoding.', () => {
     const ENVY = envy('USER', { file: './lib/encodings/.env.encoding_base64', encoding: 'hex' })
      console.log(ENVY)
      assert( Object.entries(ENVY).length > 1 )
    });
    
    it('A.13 | { encoding: "hex" } Should use specified encoding.', () => {
      const ENVY = envy('USER', { file: './lib/encodings/.env.encoding_hex', override: true })
      console.log(ENVY)
     assert( Object.entries(ENVY).length > 1 )
    });

});

describe(heading('B | Config testing'), function () {
  this.timeout(10_000)

  it('B.1 | Should correctly collect strings', () => {
    const ENVY = envy({
      stringA: 'A',
      stringB: 'B',
      stringC: 'C',
      stringD: 'D',
      stringE: 'E',
      stringF: 'F',
    }, { 
      file: '.env.types',
      prefix: 'TYPE_STRING_'
    })

    // console.log(ENVY)

    expect(ENVY.stringA).to.eq('Hello, World!')
    expect(ENVY.stringB).to.eq('Single quotes')
    expect(ENVY.stringC).to.eq('Double quotes')
    expect(ENVY.stringD).to.eq('Backticks')
    expect(ENVY.stringE).to.eq('Defined\\n with\\n newlines')
    expect(ENVY.stringF).to.eq('Defined on a new line (requires quotes)')
  })

  it('B.2 | Should correctly coerce numbers', () => {
    const ENVY = envy({
      numberA: {
        key: 'A',
        type: 'number'
      },
      numberB: {
        key: 'B',
        type: 'number'
      },
      numberC: {
        key: 'C',
        type: 'number'
      },
      numberD: {
        key: 'D',
        type: 'number'
      },
      numberE: {
        key: 'E',
        type: 'number'
      },
      numberF: {
        key: 'F',
        type: 'number'
      },
    }, { 
      file: '.env.types',
      prefix: 'TYPE_NUMBER_',
      coerce: 1,
    })

    // console.log(ENVY)

    expect(ENVY.numberA).to.eq(0)
    expect(ENVY.numberB).to.eq(1)
    expect(ENVY.numberC).to.eq(100)
    expect(ENVY.numberD).to.eq(1_000)
    expect(ENVY.numberE).to.eq(1_000_000_000)
    expect(ENVY.numberF).to.eq(3.1415)
  })

  it('B.3 | Should correctly coerce arrays', () => {
    const ENVY = envy({
      a: {
        key: 'A',
        type: 'array'
      },
      b: {
        key: 'B',
        type: 'array'
      },
      
    }, { 
      file: '.env.types',
      prefix: 'TYPE_ARRAY_'
    })

    // console.log(ENVY)

    expect(ENVY.a.length).to.eq(3)
    expect(ENVY.a[0]).to.eq('apple')
    expect(ENVY.a[1]).to.eq('banana')
    expect(ENVY.a[2]).to.eq('cherry')

    expect(ENVY.b.length).to.eq(5)
    expect(ENVY.b[0]).to.eq('1')
    expect(ENVY.b[1]).to.eq('2')
    expect(ENVY.b[2]).to.eq('3')
    expect(ENVY.b[3]).to.eq('4')
    expect(ENVY.b[4]).to.eq('5')


  })

  it('B.4 | Should correctly coerce objects', () => {
    const ENVY = envy({
      a: {
        key: 'A',
        type: 'object'
      },
      b: {
        key: 'B',
        type: 'object'
      },
      c: {
        key: 'C',
        type: 'object'
      },
      d: {
        key: 'D',
        type: 'object'
      },
      e: {
        key: 'E',
        type: 'object'
      },
      f: {
        key: 'F',
        type: 'object'
      },
  
      
    }, { 
      file: '.env.types',
      prefix: 'TYPE_OBJECT_'
    })

    // console.log(ENVY)

    expect(typeof ENVY.a).to.eq('object')
    expect(ENVY.a.myKey).to.eq('a value')

    expect(typeof ENVY.b).to.eq('object')
    expect(ENVY.b.myKey).to.eq('a value')
    
    expect(typeof ENVY.c).to.eq('string')
    expect(typeof ENVY.d).to.eq('string')
    expect(typeof ENVY.e).to.eq('string')
    expect(typeof ENVY.f).to.eq('string')


  })

  it('B.5 | should correctly infer types and coerce automatically', () => {

    const STRINGS =   envy('STRING__', { file: '.env.match', coerce: 2 })
    const NUMBERS =   envy('NUMBER__', { file: '.env.match', coerce: 2 })
    const BOOLEANS =  envy('BOOLEAN_', { file: '.env.match', coerce: 2 })
    const OBJECTS =   envy('OBJECT__', { file: '.env.match', coerce: 2 })
    const ARRAYS =    envy('ARRAY___', { file: '.env.match', coerce: 2 })

    const allStrings = Object.values(STRINGS)
    //~ DEV ONLY 
    // .filter((v,i) => i < 10)
    .every(val => typeof val === 'string')
    const allNumbers = Object.values(NUMBERS).every(val => typeof val === 'number')
    const allBooleans = Object.values(BOOLEANS).every(val => typeof val === 'boolean')
    const allObjects = Object.values(OBJECTS).every(val => (typeof val === 'object' && !Array.isArray(val)) || typeof val === 'string')
    const allArrays = Object.values(ARRAYS).every(val => (typeof val === 'object' && Array.isArray(val)) || typeof val === 'string')

    // console.log(ENVY)

    expect(allStrings).to.eq(true)
    expect(allNumbers).to.eq(true)
    expect(allBooleans).to.eq(true)
    expect(allObjects).to.eq(true)
    expect(allArrays).to.eq(true)

  })

  it('B.5 | should use defaults if defined', () => {

    const ENVY = envy({
      a:{
        key: 'EMPTY_KEY',
        default: 'abcd'
      },
      b:{
        key: 'EMPTY_KEY',
        default: 1234
      },
      c:{
        key: 'EMPTY_KEY',
        default: [1,2,3,4]
      },
    })


    expect(ENVY.a).to.eq('abcd')
    expect(ENVY.b).to.eq(1234)
    expect(ENVY.c[0]).to.eq(1)
    expect(ENVY.c[1]).to.eq(2)
    expect(ENVY.c[2]).to.eq(3)
    expect(ENVY.c[3]).to.eq(4)


  })

  it('B.6 | should not coerce defaults', () => {

    const ENVY = envy({
      a:{
        key: 'EMPTY_KEY',
        default: 'abcd',
        type: 'string'
      },
      b:{
        key: 'EMPTY_KEY',
        default: 1234,
        type: 'number'
      },
      c:{
        key: 'EMPTY_KEY',
        default: [1,2,3,4],
        type: 'array'
      },
    })


    assert(typeof ENVY.a === 'string')
    assert(typeof ENVY.b === 'number')
    assert(typeof ENVY.c === 'object' && Array.isArray(ENVY.c))

  })


});

describe(heading('C | Variable matching'), function () {
  this.timeout(10_000)

  it('C.1 | Should match process.env from each ".env" file', () => {
    const files = [
      '.env.',
      '.env.development',
      '.env.production',
      '.env.local',
      '.env.types',
      '.env.local',
      '.env.giant_file',
      '.env.match',
      '.env.testing',
    ]

    files.forEach(file => {
      const ENVY = envy(null, { file })
      
      assert(Object.entries(ENVY).every(( [k,v] ) => v === process.env[k] ))
    })

  })


});
