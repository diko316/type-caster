'use strict';


function convert(value) {
    switch (Object.prototype.toString.call(value)) {
    case '[object Boolean]': return value ? 1 : 0;
    case '[object String]':
        value = parseFloat(value);
    case '[object Number]':
        if (isFinite(value)) {
            return value;
        }
    }
    return void(0);
}


module.exports = convert;