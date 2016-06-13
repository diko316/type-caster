'use strict';

var MOMENT = require('moment'),
    CONVERT_TO_DASH_RE = /\//g;

function convert(value) {
    var m = MOMENT;
    switch (Object.prototype.toString.call(value)) {
    case '[object String]':
        value = m(value.replace(CONVERT_TO_DASH_RE, '-'), m.ISO_8601);
        break;
    case '[object Number]': // unix timestamp
    case '[object Date]':
    case '[object Object]':
    case '[object Array]':
        value = m(value);
    }
    return value instanceof m && value.isValid() ? value : void(0);
}

function validate(value) {
    var m = MOMENT;
    switch (Object.prototype.toString.call(value)) {
    case '[object String]':
        return m(value.replace(CONVERT_TO_DASH_RE, '-'), m.ISO_8601).isValid();
    case '[object Date]':
        return true;
    }
    return false;
}

module.exports = {
    convert: convert,
    validate: validate
};
