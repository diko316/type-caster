'use strict';

var CASTER = {},
    EXPORT = cast,
    LIST_CACHE = null,
    AUTO_CASTER = {};
    
    
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
    else {
        throw new Error(name + ' type do not exist.');
    }
    return false;
}

function cast(name) {
    var list = CASTER;
    var caster, valid;
    
    if (list.hasOwnProperty(name)) {
        caster = list[name];
        try {
            return caster.convert.apply(
                        EXPORT,
                        Array.prototype.slice.call(arguments, 1)
                    );
        }
        catch (e) {
            console.log(e);
        }
    }
    else {
        throw new Error(name + ' type do not exist.');
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
            if (caster instanceof F) {
                list[name] = {
                    validate: false,
                    convert: caster
                };
                if ('validate' in o && o['validate'] instanceof F) {
                    list[name].validate = o['validate'];
                }
                LIST_CACHE = null;
            }
        }
    }
    
    return EXPORT;
}

function has(name) {
    return CASTER.hasOwnProperty(name);
}

function list() {
    var casters = CASTER,
        cache = LIST_CACHE;
    var name, l;
    
    if (cache) {
        return cache;
    }
    LIST_CACHE = cache = [];
    l = 0;
    for (name in casters) {
        if (casters.hasownProperty(name)) {
            cache[l++] = name;
        }
    }
    return cache;
}

function createCasters() {
    var define = false,
        casters = {},
        type = null;
    var c, l, arg, caster;
    
    for (c = -1, l = arguments.length; l--;) {
        arg = arguments[++c];
        caster = createCaster(arg);
        if (caster) {
            casters[arg] = caster;
        }
    }
    
    return casters;
}

function createCaster(type) {
    var list = AUTO_CASTER;
    if (list.hasOwnProperty(type)) {
        return list[type];
    }
    return list[type] = wrapCaster(type);
}

function wrapCaster(type) {
    function Type() {
        var A = Array.prototype,
            applyType = cast,
            applyValidation = validate,
            defaults = A.slice.call(arguments, 0);
        
        function Validator(data) {
            var args = [type, data];
            args.push.apply(args, defaults);
            return applyValidation.apply(null, args);
        }
        
        function Caster(data) {
            var args = [type, data];
            args.push.apply(args, defaults);
            return applyType.apply(null, args);
        }
        
        Caster.type = type;
        Caster.validate = Validator;
        return Caster;
    }
    
    Type.type = type;
    
    return Type;
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
EXPORT.validate = validate;
EXPORT.list = list;
EXPORT.types = createCasters;
EXPORT.type = createCaster;

module.exports = EXPORT;

