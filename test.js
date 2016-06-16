

var type = require('./index.js'),

    arrayOfString = type('array').itemTypes('string'),
    
    recordType = type('object').
                    schema({
                        id: 'number',
                        name: type('string')
                    }).
                    requires('name');
    
//console.log(caster("string", "buang"));
//console.log(caster.validate("array", "string"));

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
        requires('shit').
        schema({
            shit: 'string'
        }).
        cast({
            id: 1,
            name: 'diko',
            shit: 'ka'
        })
);

//console.log(
//    recordType.
//        cast({
//            id: 1,
//            name: 'diko',
//            shit: 'ka'
//        })
//);