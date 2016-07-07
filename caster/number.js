'use strict';

var NUMERIC_RE = /^[\+\-]?[1-9]+[0-9]*(\.[0-9]+)?$/;

function convert(value) {
    /*jshint validthis:true */
    var config = this.config,
        min = config.min,
        max = config.max,
        interval = config.autoIncrement,
        lastIncrement = config.incrementStart;
        
    switch (Object.prototype.toString.call(value)) {
    case '[object Boolean]':
        value = value ? 1 : 0;
        break;
    
    case '[object String]':
        if (!NUMERIC_RE.test(value)) {
            return void(0);
        }
        value = parseFloat(value);
        break;
    
    case '[object Number]':
        value = isFinite(value) ? value : 0;
        break;
    
    default: return void(0);
    }
    
    if (min !== false) {
        value = Math.max(min, value);
    }
    
    if (max !== false) {
        value = Math.min(max, value);
    }
    
    if (value > lastIncrement) {
        config.incrementStart = interval ? value + interval : value;
    }
    
    return value;
}

function castDefault() {
    /*jshint validthis:true */
    var config = this.config,
        interval = config.autoIncrement;
    var last;
    
    if (interval) {
        last = config.incrementStart;
        config.incrementStart += interval;
        return last;
    }
    
    return config.defaultValue;
    
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

function autoIncrement(value) {
    if (typeof value === 'number' && isFinite(value)) {
        return Math.max(0, value);
    }
    /*jshint validthis:true */
    return 1;
}

function incrementStart(value) {
    if (typeof value === 'number' && isFinite(value)) {
        return value;
    }
    /*jshint validthis:true */
    return this.config.incrementStart;
}

function defaultValue(value) {
    /*jshint validthis:true */
    var config;
    if (typeof value === 'number' && isFinite(value)) {
        config = this.config;
        config.incrementStart = Math.max(value, config.incrementStart);
        return value;
    }
    
    return this.config.defaultValue;
}

function clone(target, superClone) {
    /*jshint validthis:true */
    var config = this.config,
        targetConfig = target.config;
    
    superClone();
    
    targetConfig.min = config.min;
    targetConfig.max = config.max;
    targetConfig.autoIncrement = config.autoIncrement;
    targetConfig.incrementStart = config.incrementStart;
}

module.exports = {
    '@config': {
        autoIncrement: 0,
        incrementStart: 1,
        min: false,
        max: false
    },
    '@clone': clone,
    '@defaultValue': castDefault,
    cast: convert,
    validate: validate,
    defaultValue: defaultValue,
    min: min,
    max: max,
    autoIncrement: autoIncrement,
    incrementStart: incrementStart
};