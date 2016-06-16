'use strict';

var type = require('../index.js'),

    arrayOfString = type('array').itemTypes('string'),
    
    recordType = type('object').
                    schema({
                        id: 'number',
                        name: type('string')
                    }).
                    strict();

console.log('is caster ', type.is(arrayOfString));

console.log(
    arrayOfString.
        cast([
            1,
            2,
            "buang"
        ])
);

type.define('buang', recordType);

console.log(
    type('buang').
        schema({
            shit: 'string'
        }).
        cast({
            id: 1,
            name: 'diko',
            shit: 'ka'
        })
);

console.log(
    recordType.
        cast({
            id: 1,
            name: 'diko',
            shit: 'ka'
        })
);