'use strict';

var MOMENT = require('moment'),
    CONVERT_TO_DASH_RE = /\//g;
    

function convert(value) {
    /*jshint validthis:true */
    var config = this.config;
    var min, max;
    value = toMoment(value);
    
    if (value) {
        min = config.min;
        max = config.max;
        
        if (min && value.isBefore(min)) {
            value = min;
        }
        else if (max && value.isAfter(max)) {
            value = max;
        }
        return value;
    }
    
    return void(0);
}

function validate(state, value) {
    /*jshint validthis:true */
    var config = this.config,
        error = state.error,
        format = 'llll';
    var min, max;
    value = toMoment(value);
    
    if (value) {
        min = config.min;
        max = config.max;
        
        if (min && value.isBefore(min)) {
            error.min = 'date must be after ' + min.format(format);
            return;
        }
        else if (max && value.isAfter(max)) {
            error.max = 'date must be before ' + max.format(format);
            return;
        }
        state.error = false;
    }
}

function min(value) {
    value = toMoment(value);
    if (value && value.isValid()) {
        return value;
    }
    /*jshint validthis:true */
    return this.config.min;
}

function max(value) {
    value = toMoment(value);
    if (value && value.isValid()) {
        return value;
    }
    /*jshint validthis:true */
    return this.config.min;
}

function toMoment(value) {
    var m = MOMENT;
    switch (Object.prototype.toString.call(value)) {
    case '[object String]':
        value = m(value.replace(CONVERT_TO_DASH_RE, '-'), m.ISO_8601);
        break;
    case '[object Number]': // unix timestamp
    case '[object Date]':
        value = m(value);
    }
    return value instanceof m && value.isValid() ? value : false;
}

function clone(target, superClone) {
    /*jshint validthis:true */
    var config = this.config,
        targetConfig = target.config;
    
    superClone();
    
    targetConfig.min = config.min;
    targetConfig.max = config.max;
}

module.exports = {
    '@config': {
        min: false,
        max: false
    },
    '@clone': clone,
    'cast': convert,
    validate: validate,
    min: min,
    max: max
};
