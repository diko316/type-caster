'use strict';


describe('"date" TYPE test',
    function () {
        
        var MOMENT = require('moment'),
            TYPE = use('index.js'),
            DATE = TYPE('date'),
            DATE_AFTER_2015 = DATE.min("2015-12-31"),
            DATE_FROM_2015_TO_2017 = DATE_AFTER_2015.max("2017-12-31");

        
        // cast()
        describe('cast(data) method',
            function () {
                it('should cast([data:Date]) to moment object',
                    function () {
                        assert(DATE.cast(new Date()) instanceof MOMENT,
                            'should convert date [new Date()] to moment object');
                    });
                
                it('should cast([data:string]) ISO-8601 string to moment object',
                    function () {
                        assert(DATE.cast("2016-10-20 4:30 +0000") instanceof MOMENT,
                            'should convert ISO-8601 string ["2016-10-20 4:30 +0000"] to moment object');
                    });
                
                it('should cast([data:number]) unix timestamp number to moment object',
                    function () {
                        assert(DATE.cast(10001) instanceof MOMENT,
                            'should convert unix timestamp number ["10001] to moment object');
                    });
                
                it('should cast([data:Moment]) and only returning the same moment object if moment.isValid()',
                    function () {
                        assert(DATE.cast(MOMENT()) instanceof MOMENT,
                            'should convert moment object [now] to moment object');
                    });
            });
        
        // validate
        describe('validate(data) method',
            function () {
                it('should validate [data:Date]',
                    function () {
                        var valid = DATE.validate(new Date());
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be valid [data:Moment]');
                    });
                
                it('should validate ISO-8601 [data:string]',
                    function () {
                        var valid = DATE.validate("2016-10-20 4:30 +0000");
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be valid [data:Moment]');
                    });
                
                it('should validate unix timestamp [data:number]',
                    function () {
                        var valid = DATE.validate(10001);
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be valid [data:Moment]');
                    });
                
                it('should validate valid moment [data:Moment]',
                    function () {
                        var valid = DATE.validate(MOMENT());
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be valid [data:Moment]');
                    });
            });
        
        // min("2015-12-31")
        describe('min("2015-12-31") method',
            function () {
                it('should convert valid date to minimum if [date:Moment] is before the minimum date',
                    function () {
                        var data = MOMENT("2015-07-24", "YYYY-MM-DD"),
                            casted = DATE_AFTER_2015.cast(data);
                        
                        assert(casted && casted !== data,
                            'should convert to minimum date instead of valid [data:Moment]');
                    });
                
                it('should apply minimum validation of moment date',
                    function () {
                        var valid = DATE_AFTER_2015.validate(
                                        MOMENT("2015-07-24", "YYYY-MM-DD")
                                    );
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should be valid [data:Moment] on or after its minimum date');
                    });
            });
        
        // max("2017-12-31")
        describe('max("2017-12-31") method',
            function () {
                it('should convert valid date to maximum if [date:Moment] is after the maximum date',
                    function () {
                        var data = MOMENT("2018-07-24", "YYYY-MM-DD"),
                            casted = DATE_FROM_2015_TO_2017.cast(data);
                        
                        assert(casted && casted !== data,
                            'should convert to maximum date instead of valid [data:Moment]');
                    });
                
                it('should apply maximum validation of moment date',
                    function () {
                        var valid = DATE_FROM_2015_TO_2017.validate(
                                        MOMENT("2018-07-24", "YYYY-MM-DD")
                                    );
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should be valid [data:Moment] on or after its minimum date');
                    });
            });
    });
