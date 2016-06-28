'use strict';

var TYPE = require('../index.js'),
    number = TYPE('number');


console.log(
    number.extend({
        cast: function () {
            return 1;
        }
    }));


console.log(
    number.extend({
        cast: function () {
            return 1;
        }
    }).cast(100));