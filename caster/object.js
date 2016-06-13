'use strict';

function convert(value) {
    switch (Object.prototype.toString.call(value)) {
    case '[object Object]': return value;
    }
    return void(0);
}

function validate(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}

module.exports = {
    convert: convert,
    validate: validate
};