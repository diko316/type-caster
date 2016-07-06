'use strict';

describe('"default" TYPE test',
    function (){
        
        var TYPE = use('index.js'),
            DEFAULT = TYPE('default');
        
        // cast()
        describe('cast(data) method',
            function () {
            
                it('should call cast([data:mixed]) accepting and return [data] without mutating',
                    function () {
                        var data, returned;
                        
                        data = {};
                        returned = DEFAULT.cast(data);
                        
                        assert(returned === data,
                            'should not mutate returned data when calling cast()');
                        
                        data = 1;
                        returned = DEFAULT.cast(data);
                        assert(returned === data,
                            'should accept number and return it');
                        
                        data = new Date();
                        returned = DEFAULT.cast(data);
                        assert(returned === data,
                            'should accept Date and return it');
                        
                    });
        });
        
        describe('validate(data) method',
            function () {
                it('should call validate([data:mixed]) accepting any data as valid returning no error',
                    function () {
                        var data, valid;
                        
                        data = new Date();
                        valid = DEFAULT.validate(data);
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should accept Date parameter and consider it as valid data');
                        
                    });
            });
    });