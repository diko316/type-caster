'use strict';


function convert(value) {
    switch (Object.prototype.toString.call(value)) {
    case '[object Boolean]': return value ? 1 : 0;
    case '[object String]':
        value = parseFloat(value);
    /* falls through */
    case '[object Number]':
        if (isFinite(value)) {
            return value;
        }
    }
    return void(0);
}

function validate(state, value) {
    /*jshint validthis:true */
    var config = this.config,
        error = state.error;
    var min, max;
    
    if (typeof value === 'number' && isFinite(value)) {
        min = config.min;
        max = config.max;
        if (min !== false && value < min) {
            error.min = 'must be at least ' + min.toString(10);
            return;
        }
        else if (max !== false && value > max) {
            error.max = 'must not exceed ' + min.toString(10);
            return;
        }
        state.error = false;
    }
}

function min(value) {
    if (typeof value === 'number' && isFinite(value)) {
        return value;
    }
    /*jshint validthis:true */
    return this.config.min;
}

function max(value) {
    if (typeof value === 'number' && isFinite(value)) {
        return value;
    }
    /*jshint validthis:true */
    return this.config.max;
}

module.exports = {
    '@config': {
        min: false,
        max: false
    },
    'cast': convert,
    validate: validate,
    min: min,
    max: max
};