'use strict';


function convert(value) {
    /*jshint validthis:true */
    var me = this,
        O = Object.prototype,
        config = me.config;
    var created, schema, requires, types, names, name,
        c, l, item, hasOwn, allowExcess, validation;
    
    if (O.toString.call(value) === '[object Object]') {
        
        hasOwn = O.hasOwnProperty;
        created = {};
        schema = config.schema;
        requires = config.requires || {};
        
        if (schema) {
            // finalize types
            if (me.$$newItemTypes) {
                resolveTypes(me);
            }
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
                console.log('*** Casted data from ' + name);
                console.log(created[name]);
                console.log('*****');
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
        
        
        validation = this.validate(created);
        if (!validation.error) {
            return created;
        }
        
        console.log('!invalid data: ', validation);
        console.log(created);
        
    }
    return void(0);
}

function validate(state, value) {
    /*jshint validthis:true */
    var me = this,
        config = me.config,
        error = state.error,
        blame = state.blame,
        O = Object.prototype;
    var schema, types, names, name, requires, l, hasOwn, bl,
        itemError, typeErrors;
    
    if (O.toString.call(value) === '[object Object]') {
        schema = config.schema;
        requires = config.requires || {};
        
        // validate schema
        if (schema) {
            // finalize types
            if (me.$$newItemTypes) {
                resolveTypes(me);
            }
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
    /*jshint validthis:true */
    var me = this,
        O = Object.prototype,
        hasOwn = O.hasOwnProperty,
        caster = me.$type,
        old = me.config.schema;
    
    var names, nl, list, name, type, types;
    
    if (O.toString.call(manifest) === '[object Object]') {
        list = {};
       
        if (old) {
            types = old.types;
            for (name in types) {
                if (hasOwn.call(types, name)) {
                    list[name] = types[name];
                }
            }
            
            names = old.names.slice(0);
            nl = names.length;
            
            // allow excess?
            if (arguments.length === 1 || typeof allowExcess === 'undefined') {
                allowExcess = old.allowExcess;
            }
        }
        else {
            names = [];
            nl = 0;
        }
        
        nl = names.length;
        
        for (name in manifest) {
            if (hasOwn.call(manifest, name)) {
                type = manifest[name];
                if (!type ||
                    (typeof type !== 'string' && !caster.is(type))) {
                    throw new Error(name + ' schema type is invalid');
                }

                if (!hasOwn.call(list, name)) {
                    names[nl++] = name;
                }
                list[name] = type;
            }
        }
        
        me.$$newItemTypes = true;
        
        return {
            allowExcess: allowExcess === true,
            names: names,
            types: list
        };
    }
    
    return old;
}

function requires(args) {
    /*jshint validthis:true */
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

function resolveTypes(typeInstance) {
    /*jshint validthis:true */
    var caster = typeInstance.$type,
        schema = typeInstance.config.schema,
        names = schema.names,
        types = schema.types;
        
    var name, type, c, l;

    for (c = -1, l = names.length; l--;) {
        name = names[++c];
        type = types[name];
        if (typeof type === 'string') {
            if (!caster.has(type)) {
                throw new Error(type + ' type in [' +
                                name + '] schema do not exist');
            }
            types[name] = caster(type);
        }
    }
    delete typeInstance.$$newItemTypes;
}

function clone(target) {
    /*jshint validthis:true */
    var config = this.config;
    var item;
    
    // recreate schema
    item = config.schema;
    if (item) {
        target.schema(item.types, item.allowExcess);
    }
    // recreate requires
    item = config.requires;
    if (item) {
        target.requires(item);
    }
}

module.exports = {
    '@config': {
        schema: false,
        requires: false
    },
    '@clone': clone,
    'cast': convert,
    validate: validate,
    schema: schema,
    requires: requires
};