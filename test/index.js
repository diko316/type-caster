'use strict';

var path = require('path'),
    mainPath = path.resolve(".");

global.should = require('chai').assert;
global.assert = require('chai').assert;
global.use = function (id) {
    return require(path.resolve(mainPath, id));
};


describe('Test package api',
    function () {
        require('./api/define.js');
        require('./api/default.js');
        require('./api/has.js');
        require('./api/is.js');
        require('./api/list.js');
        
    });


describe('Test default types',
    function () {
        require('./type/default.js');
        require('./type/string.js');
        require('./type/number.js');
        require('./type/boolean.js');
        require('./type/date.js');
        require('./type/array.js');
        require('./type/object.js');
    });