'use strict';


function convert(value) {
    switch (Object.prototype.toString.call(value))  {
    case '[object Number]':
        if (!isFinite(value)) {
            break;
        }
    case '[object String]':
    case '[object Boolean]':
        return [value];
    
    case '[object Array]':
        return value;
    }

    return void(0);
}