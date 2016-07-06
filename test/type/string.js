'use strict';

describe('"string" TYPE test',
    function (){
        
        var TYPE = use('index.js'),
            STRING = TYPE('string'),
            STRING2 = STRING.min(2),
            STRING2TO6 = STRING2.max(6);
        
        // cast()
        describe('cast(data) method',
            function () {
                it('should cast([data:boolean]) to string',
                    function () {
                        assert(STRING.cast(true) === 'true',
                            'should convert boolean [true] to string "true"');
                        
                        assert(STRING.cast(false) === 'false',
                            'should convert boolean [false] to string "false"');
                    });
                
                it('should cast([data:number]) to string',
                    function () {
                        assert(STRING.cast(1) === '1',
                            'should convert number [1] to string "1"');
                        
                        assert(STRING.cast(0) === '0',
                            'should convert number [0] to string "0"');
                        
                        assert(STRING.cast(parseInt("Buang")) === '',
                            'should convert NaN to empty string ""');
                    });
                
                it('should cast([data:array]) to string by joining its scalar items',
                    function () {
                        
                        assert(STRING.cast(["data1", "concat"]) === 'data1,concat',
                            'should convert array [string, string...] to comma separated string "string,string,..."');
                        
                        assert(STRING.cast([]) === '',
                            'should convert empty array [] to empty string ""');
        
                    });
            });
        
        
        // validate()
        describe('validate(data) method',
            function () {
                it('should validate [data:string]',
                    function () {
                        var valid = STRING.validate('test');
        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:string]');
                        
                    });
                
                it('should not validate any [data:mixed] parameter other than string',
                    function () {
                        
                        var valid = STRING.validate(1);
        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:integer]');
                        
                        valid = STRING.validate(true);
        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:integer]');
                        
                        
                        valid = STRING.validate(["test", "test2"]);
        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:integer]');
                        
                    });
            });
        
        // min(2)
        describe('min(2) method',
            function () {
                it('should apply minimum number of characters validation when configured with min([data:number])',
                    function () {
                        var valid = STRING2.validate('ab');
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:string] when having 2 or more characters');
                        
                        valid = STRING2.validate('a');
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:string] when having less than 2 characters');
                    });
            });
        
        // max(6)
        describe('max(6) method',
            function () {
                it('should truncate to max([data:number]) of characters when converting',
                    function () {
                        
                        assert(STRING2TO6.cast('abcdefghij') === 'abcdef',
                            'should truncate string "abcdefghij" to "abcdef" when configured max(6)');
                    });
                
                it('should apply maximum number of characters validation when configured with max([data:number])',
                    function () {
                        var valid = STRING2TO6.validate('abcdef');
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:string] when having 6 or less characters');
                        
                        valid = STRING2TO6.validate('abcd');
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:string] when having 6 or less characters');
                        
                        valid = STRING2TO6.validate('abcdefgh');
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not a valid [data:string] when having more than 6 characters');
                    });
            });
        
    });