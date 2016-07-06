'use strict';

var path = require('path'),
    mainPath = path.resolve(".");

global.should = require('chai').assert;
global.use = function (id) {
    return require(path.resolve(mainPath, id));
};


require('./api/define.js');
require('./api/default.js');
require('./api/has.js');
require('./api/is.js');
require('./api/list.js');