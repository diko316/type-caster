'use strict';


var type = require('../index.js'),
    objectType = type('object').
                    schema({
                        id: type('number').required(),
                        name: type('string')
                    });
                    
                    
console.log(
    objectType.validate({
        id: 1,
        name: 'diko',
        shit: 'ka'
    }));