'use strict';

describe('"boolean" TYPE test',
    function () {
        
        var TYPE = use('index.js'),
            BOOLEAN = TYPE('boolean');
        
        // cast()
        describe('cast(data) method',
            function () {
                it('should cast([data:boolean]) to boolean',
                    function () {
                        assert(BOOLEAN.cast(true) === true,
                            'should convert boolean [true] to boolean true');
                        
                        assert(BOOLEAN.cast(false) === false,
                            'should convert boolean [false] to boolean false');
                    });
                
                it('should cast([data:mixed]) to boolean',
                    function () {
                        assert(BOOLEAN.cast('test') === true,
                            'should convert non-empty string ["test"] to boolean true');
                        
                        assert(BOOLEAN.cast(1) === true &&
                               BOOLEAN.cast(-20) === true,
                            'should convert non-zero number ["test"] to boolean true');
                        
                        assert(BOOLEAN.cast(["test"]) === true,
                            'should convert non-empty array [array["test"]] to boolean true');
                        
                        assert(BOOLEAN.cast('') === false,
                            'should convert empty string [] to boolean false');
                        
                        assert(BOOLEAN.cast('false') === false,
                            'should convert string ["false"] to boolean false');
                        
                        assert(BOOLEAN.cast(0) === false,
                            'should convert zero number [0] to boolean false');
                        
                        assert(BOOLEAN.cast([]) === false,
                            'should convert empty array [array[]] to boolean false');
                        
                    });
            });
        
        // validate
        describe('validate(data) method',
            function () {
                it('should validate [data:boolean]',
                    function () {
                        var valid = BOOLEAN.validate(true);
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:boolean]');
                        
                        valid = BOOLEAN.validate(true);
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:boolean]');
                        
                    });
                
                it('should not validate [data:mixed] other than [data:boolean]',
                    function () {
                        var valid = BOOLEAN.validate(1);
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should 1 number should not be a valid [data:boolean]');
                        
                        valid = BOOLEAN.validate([]);
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:boolean]');
                        
                        valid = BOOLEAN.validate('test');
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:boolean]');
                        
                        
                        valid = BOOLEAN.validate('');
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:boolean]');
                        
                    });
            });
    });