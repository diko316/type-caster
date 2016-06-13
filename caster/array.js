'use strict';


function convert(value, cast) {
    var l, c, item;
    switch (Object.prototype.toString.call(value))  {
    case '[object Number]':
        if (isFinite(value)) {
            value = [value];
        }
        break;
    case '[object String]':
    case '[object Boolean]':
        value = [value];
        break;
    }
    
    if (value instanceof Array) {
        if (this.has(cast)) {
            value = value.slice(0);
            for (c = -1, l = value.length; l--;) {
                item = value[++c];
                value[c] = this(cast, item);
            }
        }
        return value;
    }

    return void(0);
}

function validate(value) {
    return value instanceof Array;
}

module.exports = {
    convert: convert,
    validate: validate
};