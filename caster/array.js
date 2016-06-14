'use strict';

function convert(value) {
    var types = this.config.itemTypes,
        isCopy = false;
    var l, c, item, tl, tc, ttl, type, typed, caster;
    
    switch (Object.prototype.toString.call(value))  {
    case '[object String]':
        value = Array.prototype.slice.call(value, 0);
        isCopy = true;
        
    case '[object Array]':
        tl = types && types.length;
        l = value.length;
        if (tl && l) {
            if (!isCopy) {
                value = value.slice(0);
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
        if (!this.validate(value).error) {
            return value;
        }
    }
    return void(0);
}

function validate(state, value) {
    var config = this.config,
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
    var caster = this.$type;
    var l, type, casters;
    
    if (typeof types === 'string' || caster.is(types)) {
        types = [types];
    }
    
    if (types instanceof Array) {
        casters = [];
        for (l = types.length; l--;) {
            type = types[l];
            if (caster.has(type)) {
                type = caster(type);
            }
            else if (!caster.is(type)) {
                throw new Error('itemTypes must be a valid type or type name');
            }
            casters[l] = type;
        }
        return casters;
    }
    return this.config.itemTypes;
}

function min(value) {
    if (typeof value === 'number' && isFinite(value)) {
        return Math.max(0, value);
    }
    return this.config.min;
}

function max(value) {
    if (typeof value === 'number' && isFinite(value)) {
        return Math.max(0, value);
    }
    return this.config.max;
}

module.exports = {
    '@config': {
        itemTypes: [],
        min: 0,
        max: 0
    },
    'cast': convert,
    validate: validate,
    itemTypes: itemTypes,
    min: min,
    max: max
};