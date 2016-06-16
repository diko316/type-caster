'use strict';

var CASTER = {},
    EXPORT = instantiate,
    LIST_CACHE = null;   


function define(name, caster) {
    var list = CASTER,
        F = Function,
        toString = Object.prototype.toString,
        manager = EXPORT;
    var o, key, value, properties, validator, names, nl, configure, clone;
    
    if (name && typeof name === 'string') {
        
        // redefine
        if (manager.is(caster)) {
            defineFrom(name, caster);
            return manager;
        }
        
        o = null;
        switch (toString.call(caster)) {
        case '[object Function]':
            caster.cast = caster;
        /* falls through */
        case '[object Object]':
            o = caster;
            caster = validator = configure = clone = null;
            names = [];
            nl = 0;
            properties = {};
            for (key in o) {
                if (o.hasOwnProperty(key)) {
                    value = o[key];
                    switch (key) {
                    case 'cast':
                        if (value instanceof F) {
                            caster = value;
                        }
                        break;
                    case 'validate':
                        if (value instanceof F) {
                            validator = value;
                        }
                        break;
                    case '@config':
                        if (toString.call(value) === '[object Object]') {
                            configure = value;
                        }
                        break;
                    case '@clone':
                        if (value instanceof F) {
                            clone = value;
                        }
                        break;
                    default:
                        if (value instanceof F) {
                            names[nl++] = key;
                            properties[key] = value;
                        }
                    }
                }
            }
            
            if (caster) {
                list[name] = createTypeCaster(
                                name,
                                configure,
                                caster,
                                validator,
                                clone,
                                names,
                                properties);
                LIST_CACHE = null;
            }
        }
    }
    
    return manager;
}

function defineFrom(name, caster) {
    var E = empty;
    var Proto, config, key, old;
    function Type() {
        var me = this,
            E = empty;
        if (me instanceof Type) {
            caster.constructor.apply(this, arguments);
        }
        else {
            E.prototype = Type.prototype;
            me = new E();
            Type.apply(me, arguments);
        }
        return me;
    }
    
    E.prototype = caster;
    Type.prototype = Proto = new E();
    Proto.constructor = Type;
    // renew config
    old = caster.config;
    Proto.config = config = {};
    for (key in old) {
        if (old.hasOwnProperty(key)) {
            config[key] = old[key];
        }
    }
    if (caster.$clone) {
        caster.$clone(Proto);
    }
    LIST_CACHE = null;
    CASTER[name] = Type;
    
    return EXPORT;
}

function instantiate(name) {
    var list = CASTER;
    if (list.hasOwnProperty(name)) {
        return new (list[name])();
    }
    console.log(name + ' not found!');
    return void(0);
}

function has(name) {
    return CASTER.hasOwnProperty(name);
}

function is(caster) {
    return caster instanceof BaseType;
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



function createTypeCaster(castName, defaults,
                          cast, validate, clone, names, configurators) {
    var E = empty,
        hasOwn = Object.prototype.hasOwnProperty;
    var name, c, l, properties, config;
    
    function Type() {
        var me = this,
            E = empty,
            Class = Type;
        if (me instanceof Class) {
            me.$basedOn.apply(me, arguments);
        }
        else {
            E.prototype = Type.prototype;
            me = new E();
            Class.apply(me, arguments);
        }
        return me;
    }
    
    E.prototype = BaseType.prototype;
    properties = new E();
    properties.constructor = Type;
    properties.$basedOn = BaseType;
    properties.$name = castName;
    properties.$clone = clone;
    Type.prototype = properties;
    
    // create wrapped fns
    for (c = -1, l = names.length; l--;) {
        name = names[++c];
        properties[name] = wrapConfigurator(name, configurators[name]);
    }
    
    // create validator
    if (!validate) {
        validate = defaultValidator;
    }
    
    properties.validate = function () {
        var state = {
                error: {
                    validate: 'is not a valid ' + castName
                },
                blame: []
            },
            args = [state];
        args.push.apply(args, arguments);
        try {
            validate.apply(this, args);
        }
        catch (e) {
            state.error = { 'validate': 'validator has Internal Errors' };
            console.warn('validate type ' + castName + ' error ');
            console.warn(e);
        }
        return state;
    };
    
    // create caster
    properties.cast = function () {
        var me = this,
            defaultValue = me.config.defaultValue;
        try {
            return arguments.length ?
                    cast.apply(me, arguments) : defaultValue;
        }
        catch (e) {
            console.warn('type cast ' + castName + ' error ');
            console.warn(e);
        }
        return defaultValue;
    };
    if (defaults) {
        config = {};
        for (name in defaults) {
            if (hasOwn.call(defaults, name)) {
                config[name] = defaults[name];
            }
        }
        properties.config = config;
    }
    
    return Type;
}

function wrapConfigurator(name, Configurator) {
    return function () {
        var value = void(0);
        try {
            value = Configurator.apply(this, arguments);
        }
        catch (e) {
            console.warn(e);
        }
        this.config[name] = value;
        return this;
    };
}

function defaultValidator(state) {
    state.error = false;
}

function empty() {
}

function BaseType() {
    var config = this.config,
        newConfig = {};
    var name;
    
    // create a copy of config
    for (name in config) {
        if (config.hasOwnProperty(name)) {
            newConfig[name] = config[name];
        }
    }

}

BaseType.prototype = {
    $type: EXPORT,
    config: {
        defaultValue: void(0)
    },
    constructor: BaseType,
    defaultValue: wrapConfigurator('defaultValue', function (value) {
                    return arguments.length ?
                            value : this.config.defaultValue;
                })
};

// api
EXPORT['default'] = EXPORT;
EXPORT.define = define;
EXPORT.has = has;
EXPORT.list = list;
EXPORT.is = is;

// define default casters
define('default', require('./caster/default.js'));
define('string', require('./caster/string.js'));
define('number', require('./caster/number.js'));
define('boolean', require('./caster/boolean.js'));
define('object', require('./caster/object.js'));
define('array', require('./caster/array.js'));
define('date', require('./caster/date.js'));




module.exports = EXPORT;

