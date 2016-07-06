'use strict';

function convert(value) {
    if (typeof value === 'number') {
        return isFinite(value) && value !== 0;
    }
    else if (value === 'false' || value === '0') {
        return false;
    }
    else if (value instanceof Array) {
        return value.length > 0;
    }
    return !!value;
}

function validate(state, value) {
    
    if (typeof value === 'boolean') {
        state.error = false;
    }
    
}

module.exports = {
    'cast': convert,
    validate: validate
};
