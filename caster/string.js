'use strict';

function convert(value) {
    /*jshint validthis:true */
    var config = this.config;
    var str, l, strs, max;
    
    switch (Object.prototype.toString.call(value)) {
    case '[object Boolean]':
        value = value ? 'true' : 'false';
        break;
    case '[object Number]':
        if (isFinite(value)) {
            value = value.toString(10);
        }
        else {
            value = '';
        }
        break;
    case '[object Array]':
        strs = value.slice(0);
        for (l = strs.length; l--;) {
            str = strs[l];
            switch (typeof str) {
            case 'boolean':
                strs[l] = str ? 'true' : 'false';
                break;
            case 'number':
                if (isFinite(str)) {
                    strs[l] = str.toString(10);
                }
                else {
                    strs[l] = '';
                }
            /* falls through */
            case 'string':
                strs[l] = str;
                break;
            default:
                strs.splice(l, 1);
            }
        }
        value = strs.join(',');
    }
    
    if (typeof value === 'string') {
        l = value.length;
        max = config.max;
        
        if (max && l > max) {
            return value.substring(0, max);
        }
        return value;
    
    }
    
    return void(0);    
}

function validate(state, value) {
    /*jshint validthis:true */
    var config = this.config,
        error = state.error;
    var min, max, len;
    
    if (typeof value === 'string') {
        len = value.length;
        min = config.min;
        max = config.max;
        
        if (min && len < min) {
            error.min = 'requires at least ' + min + ' characters';
            return;
        }
        else if (max && len > max) {
            error.max = 'must not exceed ' + max + ' characters';
            return;
        }
        state.error = false;
    }
}

function min(value) {
    if (typeof value === 'number' && isFinite(value)) {
        return Math.max(value, 0);
    }
    /*jshint validthis:true */
    return this.config.min;
}

function max(value) {
    if (typeof value === 'number' && isFinite(value)) {
        return Math.max(value, 0);
    }
    /*jshint validthis:true */
    return this.config.max;
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
        min: 0,
        max: 0
    },
    '@clone': clone,
    'cast': convert,
    validate: validate,
    min: min,
    max: max
};