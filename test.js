

var caster = require('./index.js'),
    types = caster.types('array');
    
//console.log(caster("string", "buang"));
//console.log(caster.validate("array", "string"));


console.log(
    types.array('string')([
        1, 2, "buang"
    ])
);