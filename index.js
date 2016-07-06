'use strict';

var CASTER = {},
    EXPORT = instantiate,
    LIST_CACHE = null;   


function define(name, caster) {
    var manager = EXPORT;
    var Type;
    
    if (name && typeof name === 'string') {
        
        // redefine
        if (manager.is(caster)) {
            Type = extend(caster, {});
        }
        // raw define
        else {
            Type = extend(new BaseType(), caster);
        }
        
        // register
        if (Type) {
            CASTER[name] = Type;
            Type.prototype.$name = name;
            LIST_CACHE = null;
        }
        
    }
    
    return manager;
}


function extend(caster, properties) {
    var E = empty,
        BaseType = caster.constructor,
        hasOwn = Object.prototype.hasOwnProperty;
    var Proto, config, key, old;
    function Type() {
        BaseType.apply(this, arguments);
    }
    
    E.prototype = caster;
    Type.prototype = Proto = new E();

    Proto.constructor = Type;
    
    // renew config
    old = caster.config;
    
    Proto.config = config = {};
    for (key in old) {
        if (hasOwn.call(old, key)) {
            config[key] = old[key];
        }
    }
    caster.$clone(Proto);
    return createTypeProperties(BaseType, Type, properties);
}

function instantiate(name) {
    var list = CASTER;
    if (list.hasOwnProperty(name)) {
        return new (list[name])();
    }
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
        if (casters.hasOwnProperty(name)) {
            cache[l++] = name;
        }
    }
    return cache;
}


function createTypeProperties(SuperClass, TypeClass, properties) {
    var O = Object.prototype,
        hasOwn = O.hasOwnProperty,
        toString = O.toString,
        F = Function,
        o = TypeClass.prototype,
        caster = null,
        validator = caster,
        configure = caster,
        clone = caster,
        config = o.config;
        
    var key, value;
        
    for (key in properties) {
        if (hasOwn.call(properties, key)) {
            value = properties[key];
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
                    o[key] = wrapConfigurator(key, value);
                }
            }
        }
    }
    
    // create caster
    if (caster) {
        o.cast = function () {
            var me = this,
                defaultValue = me.config.defaultValue;
            try {
                return arguments.length ?
                        caster.apply(me, arguments) : defaultValue;
            }
            catch (e) {
                console.warn(
                    'type cast ' +
                    (this.$name || '[unknown]') +
                    ' error ');
                console.warn(e);
            }
            return defaultValue;
        };
    }
    
    // create validator
    if (validator) {
        o.validate = function () {
            var castName = this.$name || '[unknown]',
                state = {
                    error: {
                        validate: 'is not a valid ' + castName
                    },
                    blame: []
                },
                
                args = [state];
            args.push.apply(args, arguments);
            try {
                validator.apply(this, args);
            }
            catch (e) {
                state.error = { 'validate': 'validator has Internal Errors' };
                console.warn('validate type ' + castName + ' error ');
                console.warn(e);
            }
            return state;
        };
    
    }
    
    // create configs
    if (configure) {
        for (key in configure) {
            if (hasOwn.call(configure, key)) {
                config[key] = configure[key];
            }
        }
    }
    
    // clone
    if (clone) {
        if (!SuperClass) {
            SuperClass = BaseType;
        }
        properties.$clone = function (target) {
            var me = this;
            clone.call(me,
                        target,
                        function () {
                            SuperClass.prototype.$clone.call(me, target);
                        });
        };
    }
    
    return TypeClass;
    
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
    this.config = newConfig;

}

BaseType.prototype = {
    
    $type: EXPORT,
    
    config: {
        defaultValue: void(0),
        required: false
    },
    
    constructor: BaseType,
    
    defaultValue: wrapConfigurator('defaultValue', function (value) {
                    return arguments.length ?
                            value : this.config.defaultValue;
                }),
    
    required: wrapConfigurator('required', function (value) {
                    return !arguments.length || value !== false;
                }),
    
    validate: function () {
        return {
                error: false,
                blame: []
            };
    },
    
    cast: function (data) {
        return data;
    },
    
    $clone: function (target) {
        var config = this.config,
            targetConfig = target.config;
            
        targetConfig.defaultValue = config.defaultValue;
        targetConfig.required = config.required;
        
    },
    
    extend: function (properties) {
        return new (extend(this, properties))();
    }
    
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

