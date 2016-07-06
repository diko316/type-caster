'use strict';

describe('"number" TYPE test',
    function () {
        
        var TYPE = use('index.js'),
            NUMBER = TYPE('number'),
            NUMBER100 = NUMBER.min(100),
            NUMBER100TO350 = NUMBER.max(350);
            
        // cast()
        describe('cast(data) method',
            function () {
                it('should cast([data:boolean]) to number',
                    function () {
                        assert(NUMBER.cast(true) === 1,
                            'should convert boolean [true] to number 1');
                        
                        assert(NUMBER.cast(false) === 0,
                            'should convert boolean [false] to number 0');
                    });
                
                it('should cast([data:string=numeric]) to number',
                    function () {
                        assert(NUMBER.cast('111') === 111,
                            'should convert numeric string [111] to number 111');
                        
                        assert(NUMBER.cast('101.12') === 101.12,
                            'should convert float numeric string [101.12] to number 101.12');
                    });
                
                it('should cast([data:number]) and just return it without conversion',
                    function () {
                        assert(NUMBER.cast(111) === 111,
                            'should convert number [111] to number 111');
                        
                        assert(NUMBER.cast(101.12) === 101.12,
                            'should convert float number [101.12] to number 101.12');
                    });
            });
        
        // validate
        describe('validate(data) method',
            function () {
                it('should validate [data:number]',
                    function () {
                        var valid = NUMBER.validate(111);
        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:number]');
                    });
                
                it('should not validate [data:mixed] other than [data:number]',
                    function () {
                        var valid = NUMBER.validate('111');
        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:number]');
                        
                        valid = NUMBER.validate(true);
        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:number]');
                        
                        valid = NUMBER.validate(null);
        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:number]');
                    });
            });
        
        // min(100)
        describe('min(100) method',
            function () {
                it('should convert to minimum number if [data:number] is less than minimum',
                    function () {
                        
                        assert(NUMBER100.cast(89) === 100,
                            'should convert to minimum number [100] instead of current 89');
                    });
                
                it('should apply minimum number validation when configured with min([data:number])',
                    function () {
                        var valid = NUMBER100.validate(100);
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:number] when more than 100');
                        
                        valid = NUMBER100.validate(98);
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:number] when less than 100');
                    });
            });
        
        // max(350)
        describe('max(350) method',
            function () {
                it('should convert to maximum number if [data:number] is more than maximum',
                    function () {
                        assert(NUMBER100TO350.cast(589) === 350,
                            'should convert to maximum number [350] instead of current 589');
                    });
                
                it('should apply maximum number validation when configured with max([data:number])',
                    function () {
                        var valid = NUMBER100TO350.validate(250);
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:number] when less than 350');
                        
                        valid = NUMBER100TO350.validate(589);
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:number] when more than 350');
                    });
            });
    });