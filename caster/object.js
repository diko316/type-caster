'use strict';


function convert(value) {
    var O = Object.prototype,
        config = this.config;
    var created, schema, requires, types, names, name,
        c, l, item, hasOwn, allowExcess;
    
    if (O.toString.call(value) === '[object Object]') {
        
        hasOwn = O.hasOwnProperty;
        created = {};
        schema = config.schema;
        requires = config.requires || {};
        
        if (schema) {
            types = schema.types;
            names = schema.names;
            allowExcess = schema.allowExcess;
        }
        else {
            types = {};
            allowExcess = true;
            names = false;
        }
        
        
        
        // apply to created
        for (name in value) {
            if (hasOwn.call(value, name)) {
                item = value[name];
                // cast
                if (hasOwn.call(types, name)) {
                    item = types[name].cast(item);
                }
                else if (!allowExcess) {
                    continue;
                }
                created[name] = item;
            }
        }
        
        // apply from schema
        if (names) {
            for (c = -1, l = names.length; l--;) {
                name = names[++c];
                
                // force apply, only defaults can create values
                if (!hasOwn.call(created, name) &&
                    hasOwn.call(requires, name)) {
                    created[name] = types[name].cast();
                }
            }
        }
        
        if (!this.validate(created).error) {
            return created;
        }
        
    }
    return void(0);
}

function validate(state, value) {
    var config = this.config,
        error = state.error,
        blame = state.blame,
        O = Object.prototype;
    var schema, types, names, name, requires, l, hasOwn, item, bl,
        itemError, typeErrors;
    
    if (O.toString.call(value) === '[object Object]') {
        schema = config.schema;
        requires = config.requires || {};
        
        // validate schema
        if (schema) {
            types = schema.types;
            names = schema.names;
            hasOwn = O.hasOwnProperty;
            bl = 0;
            typeErrors = {};
            
            // validate type
            for (l = names.length; l--;) {
                name = names[l];
                
                if (!hasOwn.call(value, name)) {
                    if (hasOwn.call(requires, name)) {
                        typeErrors[name] = 'does not have [' + name + ']';
                        blame[bl++] = name;
                    }
                    continue;
                }
                itemError = types[name].validate(value[name]).error;
                if (itemError) {
                    typeErrors[name] = '[' + name + '] ' + itemError.validate;
                    blame[bl++] = name;
                }
            }
            
            // validate excess
            if (schema.allowExcess) {
                for (name in value) {
                    if (hasOwn.call(value, name) && !hasOwn.call(types, name)) {
                        typeErrors[name] = 'must not contain [' + name + ']';
                        blame[bl++] = name;
                    }
                }
            }
            
            if (bl) {
                error.schema = typeErrors;
                return;
            }

        }

        state.error = false;
    }
}

function schema(manifest, allowExcess) {
    var O = Object.prototype,
        hasOwn = O.hasOwnProperty,
        caster = this.$type,
        old = this.config.schema;
    
    var names, nl, list, name, type, item, types;
    
    if (O.toString.call(manifest) === '[object Object]') {
        list = {};
        names = [];
       
        if (old) {
            types = old.types;
            for (name in types) {
                if (hasOwn.call(types, name)) {
                    list[name] = types[name];
                }
            }
            names.push.apply(names, old.names);
            
            // allow excess?
            if (arguments.length === 1 || typeof allowExcess === 'undefined') {
                allowExcess = old.allowExcess;
            }
        }
        
        nl = names.length;
        
        for (name in manifest) {
            if (hasOwn.call(manifest, name)) {
                type = manifest[name];
                if (caster.has(type)) {
                    type = caster(type);
                }
                else if (!caster.is(type)) {
                    throw new Error(
                                'schema type must be a valid type or type name'
                            );
                }
                if (!hasOwn.call(list, name)) {
                    names[nl++] = name;
                }
                list[name] = type;
            }
        } 
        
        return {
            allowExcess: allowExcess === true,
            names: names,
            types: list
        };
    }
    
    return old;
}

function requires(args) {
    var current = this.config.requires;
    var name, c, l;
    
    if (args && typeof args === 'string') {
        args = [args];
    }
    
    if (args instanceof Array) {
        if (!current) {
            current = {};
        }
        for (c = -1, l = args.length; l--;) {
            name = args[++c];
            if (!name || typeof name !== 'string') {
                throw new Error('required attribute name is not valid');
            }
            current[name] = true;
        }
    }
    return current;
}


module.exports = {
    '@config': {
        schema: false,
        requires: false
    },
    'cast': convert,
    validate: validate,
    schema: schema,
    requires: requires
};