'use strict';

describe('"array" TYPE test',
    function () {
        
        var TYPE = use('index.js'),
            ARRAY = TYPE('array');
        
        // cast()
        describe('cast(data) method',
            function () {
                it('should cast([data:array]) to array (no conversion)',
                    function () {
                        var data = ["test1", 1];
                        
                        assert(ARRAY.cast(data) === data,
                            'should return the same array parameter');

                    });
            });
        
        // validate
        describe('validate(data) method',
            function () {
                it('should validate [data:array]',
                    function () {
                        var valid = ARRAY.validate(["test1", 1]);
        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:array]');
                    });
            });
    });