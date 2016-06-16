'use strict';

function convert(value) {
    /*jshint validthis:true */
    var me = this,
        types = me.config.itemTypes,
        isCopy = false;
    var l, c, item, tl, tc, ttl, type;
    
    switch (Object.prototype.toString.call(value))  {
    case '[object String]':
        value = Array.prototype.slice.call(value, 0);
        isCopy = true;
    /* falls through */
    case '[object Array]':
        tl = types && types.length;
        l = value.length;
        if (tl && l) {
            if (!isCopy) {
                value = value.slice(0);
            }
            // finalize types
            if (me.$$newItemTypes) {
                resolveTypes(me);
            }
            next: for (c = -1, l = value.length; l--;) {
                item = value[++c];
                for (tc = -1, ttl = tl; ttl--;) {
                    type = types[++tc];
                    if (type.validate(item)) {
                        value[c] = type.cast(item);
                        continue next;
                    }
                }
                value[c] = void(0);
            }
        }
        if (!me.validate(value).error) {
            return value;
        }
    }
    return void(0);
}

function validate(state, value) {
    /*jshint validthis:true */
    var me = this,
        config = me.config,
        error = state.error,
        blame = state.blame;
    var min, max, len, types, type, tl, total, l, item,
        bl, typeErrors, itemError;
    
    if (value instanceof Array) {
        
        min = config.min;
        max = config.max;
        len = value.length;
        
        if (min && len < min) {
            error.min = 'must contain at least ' + min + ' number of items';
            return;
        }
        else if (max && len > max) {
            error.max = 'must not exceed ' + max + ' number of items';
            return;
        }
        
        types = config.itemTypes;
        l = value.length;
        total = types && types.length;
        if (total && l) {
            // finalize types
            if (me.$$newItemTypes) {
                resolveTypes(me);
            }
            typeErrors = [];
            bl = 0;
            next: for (; l--;) {
                item = value[l];
                tl = total;
                for (; tl--;) {
                    type = types[tl];
                    itemError = types[tl].validate(item).error;
                    if (!itemError) {
                        continue next;
                    }
                }
                // has invalid item
                typeErrors[bl] = itemError.validate;
                blame[bl++] = l;
            }
            if (bl) {
                error.itemTypes = typeErrors;
                return;
            }
        }
        state.error = false;
    }
}

function itemTypes(types) {
    /*jshint validthis:true */
    var me = this,
        caster = me.$type;
    var l, type, casters;
    
    if (typeof types === 'string' || caster.is(types)) {
        types = [types];
    }
    
    if (types instanceof Array) {
        casters = [];
        for (l = types.length; l--;) {
            type = types[l];
            if (!type ||
                (typeof type !== 'string' && !caster.is(type))) {
                throw new Error('item in itemTypes is invalid');
            }
            casters[l] = type;
        }
        me.$$newItemTypes = true;
        return casters;
    }
    return me.config.itemTypes;
}

function min(value) {
    if (typeof value === 'number' && isFinite(value)) {
        return Math.max(0, value);
    }
    /*jshint validthis:true */
    return this.config.min;
}

function max(value) {
    if (typeof value === 'number' && isFinite(value)) {
        return Math.max(0, value);
    }
    /*jshint validthis:true */
    return this.config.max;
}

function clone(target) {
    /*jshint validthis:true */
    var itemTypes = this.config.itemTypes;
    if (itemTypes) {
        target.itemTypes(itemTypes);
    }
}

function resolveTypes(typeInstance) {
    var caster = typeInstance.$type,
        types = typeInstance.config.itemTypes;
        
    var type, c, l;

    for (c = -1, l = types.length; l--;) {
        type = types[++c];
        if (typeof type === 'string') {
            if (!caster.has(type)) {
                throw new Error(type + ' in itemTypes do not exist');
            }
            types[c] = caster(type);
        }
    }
    delete typeInstance.$$newItemTypes;
    
    return true;
}



module.exports = {
    '@config': {
        itemTypes: false,
        min: 0,
        max: 0
    },
    '@clone': clone,
    'cast': convert,
    validate: validate,
    itemTypes: itemTypes,
    min: min,
    max: max
};