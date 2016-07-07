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
                        
            OBJECT_STRICT = OBJECT.strict(),
            
            OBJECT_REQUIRE_ID = OBJECT_STRICT.schema({
                            id: TYPE('number').
                                    required()
                        }),
            OBJECT_REQUIRE_ID_WITH_DEFAULT = OBJECT_STRICT.schema({
                            id: TYPE('number').
                                    required().
                                    autoIncrement().
                                    defaultValue(68)
                        });
        
        // cast()
        describe('cast(data) method',
            function () {
                it('should cast([data:object]) to object with properties, type-casted according to schema',
                    function () {
                        var result = OBJECT.cast({
                                    id: '1',
                                    name: 'test',
                                    createdAt: new Date(),
                                    extra: 'extra property'
                                });
                        
                        assert(Object.prototype.toString.call(result) === '[object Object]',
                            'should be converted into valid object');
                        
                        assert(result.id === 1,
                            'should have its properties converted/casted to correct type according to schema declaration');
                        
                        assert(result.name === 'test',
                            'should have its properties converted/casted to correct type according to schema declaration');
                        
                        assert(result.createdAt instanceof MOMENT,
                            'should have its properties converted/casted to correct type according to schema declaration');
                        
                        assert(result.extra === 'extra property',
                            'should include extra property for non-strict schema');

                    });
                
                it('should cast([data:object]) to null if one of the required property is not defined',
                    function () {
                        var result = OBJECT_REQUIRE_ID.cast({
                                    name: 'test',
                                    createdAt: new Date(),
                                    extra: 'extra property'
                                });
                        assert(result === null,
                            'should convert to null when one of the required property is not defined');
                        
                    });
                
                it('should cast([data:object]) to object with required property filled default value only if it has default value',
                    function () {
                        var result = OBJECT_REQUIRE_ID_WITH_DEFAULT.cast({
                                    name: 'test',
                                    createdAt: new Date(),
                                    extra: 'extra property'
                                });
                        assert(result.id === 68,
                            'should convert to null when one of the required property is not defined');
                        
                        result = OBJECT_REQUIRE_ID_WITH_DEFAULT.cast({
                                    name: 'test',
                                    createdAt: new Date(),
                                    extra: 'extra property'
                                });
                        
                        assert(result.id === 69,
                            'should convert to null when one of the required property is not defined');
                        
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
                
                it('should not validate [data:object] if one of the required property is not defined',
                    function () {
                        var valid = OBJECT_REQUIRE_ID.validate({
                                    name: 'test',
                                    createdAt: new Date(),
                                    extra: 'extra property'
                                });
                        
                        assert(valid.error !== false,
                            'should not be valid [data:object] if one of its required property is not defined');
                    });
            });
        
        // strict
        describe('strict() method',
            function () {
                it('should convert [data:object] without including unspecified properties in schema declaration',
                    function () {
                        var result = OBJECT_STRICT.cast({
                                    id: 1,
                                    name: 'test',
                                    createdAt: new Date(),
                                    extra: 'extra property'
                                });
                        
                        assert(result.extra !== 'extra property',
                            'should not include extra property for strict schema');
                    });
                
                it('should not validate [data:object] if it has extra property',
                    function () {
                        var valid = OBJECT_STRICT.validate({
                                    id: 1,
                                    name: 'test',
                                    createdAt: new Date(),
                                    extra: 'extra property'
                                });

                        assert(valid.error !== false,
                            'should not be a valid [data:object] if it includes extra property for strict schema');
                    });
                
                
            });
    });