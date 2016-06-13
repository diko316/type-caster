'use strict';

var CASTER = {},
    EXPORT = cast;
    
    
function validate(name) {
    var list = CASTER;
    var caster, valid;
    
    if (list.hasOwnProperty(name)) {
        caster = list[name];
        if (!caster.validate) {
            return true;
        }
        try {
            return caster.validate.apply(
                        EXPORT,
                        Array.prototype.slice.call(arguments, 1)
                    ) !== false;
        }
        catch (e) {}
    }
    return false;
}

function cast(name) {
    var list = CASTER;
    var caster, valid;
    
    if (validate.apply(null, arguments)) {
        caster = list[name];
        try {
            return caster.convert.apply(
                        EXPORT,
                        Array.prototype.slice.call(arguments, 1)
                    );
        }
        catch (e) {}
    }
    
    return void(0);
}

function define(name, caster) {
    var list = CASTER,
        F = Function;
    var o;
    
    if (name && typeof name === 'string') {
        o = null;
        switch (Object.prototype.toString.call(caster)) {
        case '[object Function]':
        case '[object Object]':
            o = caster;
            if ('default' in o && o['default'] instanceof F) {
                caster = o['default'];
            }
            else if (o.convert instanceof F) {
                caster = o['convert'];
            }
            if (caster instanceof Function) {
                list[name] = {
                    validate: false,
                    convert: caster
                };
                if ('validate' in o && o['validate'] instanceof F) {
                    list[name].validate = o['validate'];
                }
            }
        }
    }
    
    return EXPORT;
}

function has(name) {
    return EXPORT.hasOwnProperty(name);
}

// define default casters
define('default', require('./caster/default.js'));
define('string', require('./caster/string.js'));
define('number', require('./caster/number.js'));
define('boolean', require('./caster/boolean.js'));
define('array', require('./caster/array.js'));
define('date', require('./caster/date.js'));

// api
EXPORT.define = define;
EXPORT.has = has;

module.exports = EXPORT;

