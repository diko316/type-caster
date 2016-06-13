'use strict';

function convert(value) {
    switch (Object.prototype.toString.call(value)) {
    case '[object Object]': return value;
    }
    return void(0);
}

module.exports = convert;