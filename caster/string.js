'use strict';


function fromArray(value) {
    var c = -1,
        l = value.length,
        strs = [],
        sl = 0,
        undef = void(0);
    var str;
    for (; l--;) {
        str = convert(value[++c]);
        if (str !== undef) {
            strs[sl++] = str;
        }
    }
    return strs.join(',');
}

function convert(value) {
    var undef = void(0);
    var str, undef, c, l, sl, strs, me;
    
    switch (Object.prototype.toString.call(value)) {
    case '[object Boolean]': return value ? 'true' : 'false';
    case '[object Number]':
        if (isFinite(value)) {
            return value.toString(10);
        }
        break;
    case '[object Array]':
        me = convert;
        if (!me.converting) {
            me.converting = true;
            strs = [];
            sl = 0;
            for (c = -1, l = value.length; l--;) {
                str = convert(value[++c]);
                if (str !== undef) {
                    strs[sl++] = str;
                }
            }
            delete me.converting;
            return strs.join(',');
        }
        
    case '[object String]': return value;
    }
    return void(0);    
}


module.exports = convert;