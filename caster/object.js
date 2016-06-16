'use strict';


function convert(value) {
    /*jshint validthis:true */
    var me = this,
        O = Object.prototype,
        config = me.config,
        undef = void(0);
    var created, types, names, name,
        c, l, item, itemType, hasOwn;
    
    if (O.toString.call(value) === '[object Object]') {
        
        // finalize types
        if (me.$$newItemTypes) {
            resolveTypes(me);
        }
        
        hasOwn = O.hasOwnProperty;
        created = {};
        names = config.$schemaNames;
        types = config.schema;
        
        // apply schema properties
        for (c = -1, l = names.length; l--;) {
            name = names[++c];
            itemType = types[name];
            
            // cast value according to type
            if (hasOwn.call(value, name)) {
                item = itemType.cast(value[name]);
                
            }
            // auto-fill value
            else if (itemType.config.required) {
                item = itemType.cast();
                
                // fail if default value is not valid
                if (itemType.validate(item).error) {
                    return undef;
                }
                
            }
            // leave out
            else {
                continue;
            }
            created[name] = item;
        }
        
        // apply extra properties only if not strict
        if (!config.strict) {
            for (name in value) {
                if (hasOwn.call(value, name) && !hasOwn.call(types, name)) {
                    created[name] = value[name];
                }
            }
        }
        
        return created;
        
    }
    return undef;
}

function validate(state, value) {
    /*jshint validthis:true */
    var me = this,
        config = me.config,
        error = state.error,
        blame = state.blame,
        O = Object.prototype;
    var types, names, name, l, hasOwn, bl,
        itemError, typeErrors, itemType;
    
    if (O.toString.call(value) === '[object Object]') {
        // finalize types
        if (me.$$newItemTypes) {
            resolveTypes(me);
        }
        
        names = config.$schemaNames;
        hasOwn = O.hasOwnProperty;
        types = config.schema;
        bl = 0;
        typeErrors = {};
        
        // validate type
        for (l = names.length; l--;) {
            name = names[l];
            itemType = types[name];
            
            // check if required
            if (!hasOwn.call(value, name)) {
                if (itemType.config.required) {
                    typeErrors[name] = '[' + name + '] is required';
                    blame[bl++] = name;
                }
                continue;
            }
            // type validate
            itemError = itemType.validate(value[name]).error;
            if (itemError) {
                typeErrors[name] = '[' + name + '] ' + itemError.validate;
                blame[bl++] = name;
            }
        }
        
        // validate excess
        if (config.strict) {
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

        state.error = false;
    }
}

function schema(manifest) {
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
        me.config.$schemaNames = names;
        return list;
    }
    
    return old;
}

function strict(value) {
    return !arguments.length || value !== false;
}

function resolveTypes(typeInstance) {
    /*jshint validthis:true */
    var caster = typeInstance.$type,
        config = typeInstance.config,
        types = config.schema,
        names = config.$schemaNames;
        
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

function clone(target, superClone) {
    /*jshint validthis:true */
    var config = this.config,
        targetConfig = target.config;
    var targetItem, item, name, hasOwn;
    
    superClone();
    
    hasOwn = Object.prototype.hasOwnProperty;
    
    // set strict
    targetConfig.strict = config.strict;
    
    // recreate schema
    item = config.schema;
    targetItem = targetConfig.schema = {};
    for (name in item) {
        if (hasOwn.call(item, name)) {
            targetItem[name] = item[name];
        }
    }
    targetConfig.$schemaNames = config.$schemaNames.slice(0);
    item = config.$$newItemTypes;
    if (item) {
        targetConfig.$$newItemTypes = item;
    }

}

module.exports = {
    '@config': {
        strict: false,
        $schemaNames: [],
        schema: false
    },
    '@clone': clone,
    'cast': convert,
    validate: validate,
    schema: schema,
    strict: strict
};