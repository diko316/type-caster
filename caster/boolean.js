'use strict';

function convert(value) {
    if (typeof value === 'number') {
        return isFinite(value) && value !== 0;
    }
    return !!value;
}

function validate(value) {
    return typeof value === 'boolean';
}

module.exports = {
    convert: convert,
    validate: validate
};
