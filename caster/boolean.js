'use strict';

function convert(value) {
    if (typeof value === 'number') {
        return isFinite(value) && value !== 0;
    }
    return !!value;
}

module.exports = convert;
