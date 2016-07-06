'use strict';

describe('"number" TYPE test',
    function () {
        
        var TYPE = use('index.js'),
            NUMBER = TYPE('number');
        
        // cast()
        it('should cast([data:boolean]) to number',
            function () {
                assert(NUMBER.cast(true) === 1,
                    'should convert boolean [true] to number 1');
                
                assert(NUMBER.cast(false) === 0,
                    'should convert boolean [false] to number 1');
            });
        
        // validate
        it('should validate [data:number]',
            function () {
                var valid = NUMBER.validate(111);

                assert(Object.prototype.toString.call(valid) === '[object Object]',
                    'should return validation object');
                
                assert(valid.error === false,
                    'should be a valid [data:number]');
            });
    });