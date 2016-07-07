'use strict';

describe('"object" TYPE test',
    function () {
        
        var TYPE = use('index.js'),
            MOMENT = require('moment'),
            OBJECT = TYPE('object').
                        schema({
                            id: 'number',
                            name: 'string',
                            createdAt: 'date'
                        }),
            OBJECT_STRICT = OBJECT.strict();
        
        // cast()
        describe('cast(data) method',
            function () {
                it('should cast([data:object]) to another object instance with properties, type-casted according to schema',
                    function () {
                        var result = OBJECT.cast({
                                    id: '1',
                                    name: 'test',
                                    createdAt: new Date()
                                });
                        
                        assert(Object.prototype.toString.call(result) === '[object Object]',
                            'should be converted into valid object');
                        
                        assert(result.id === 1,
                            'should have its properties converted/casted to correct type according to schema declaration');
                        
                        assert(result.name === 'test',
                            'should have its properties converted/casted to correct type according to schema declaration');
                        
                        assert(result.createdAt instanceof MOMENT,
                            'should have its properties converted/casted to correct type according to schema declaration');

                    });
            });
        
        // validate
        describe('validate(data) method',
            function () {
                it('should validate [data:object]',
                    function () {
                        var valid = OBJECT.validate({
                                    id: 1,
                                    name: 'test',
                                    createdAt: new Date()
                                });
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:object]');
                        
                        
                        valid = OBJECT.validate({
                                    id: '1',
                                    name: 'test',
                                    createdAt: new Date()
                                });
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:object] if one of its property is not valid');
                        
                        assert(Object.prototype.toString.call(valid.error.schema) === '[object Object]',
                            'should have [schema:object] validation error');
                        
                        assert(typeof valid.error.schema.id === 'string',
                            'should have [schema:object] an invalid property error message');
                        
                        assert(valid.blame.indexOf('id') !== -1,
                            'should have [blame:array[string]] blaming an invalid property');
                        
                        valid = OBJECT.validate({
                                    id: 1,
                                    name: 'test',
                                    createdAt: new Date(),
                                    extra: 'extra property'
                                });
                
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:object] if one of its property is not defined in schema declaration');
                        
                        
                    });
            });
        
    });