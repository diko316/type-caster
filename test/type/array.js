'use strict';

describe('"array" TYPE test',
    function () {
        
        var TYPE = use('index.js'),
            ARRAY = TYPE('array'),
            ARRAYOF_STRING_NUMBER = ARRAY.itemTypes('string', 'number'),
            ARRAYOF_STRING_NUMBER_3_ITEMS = ARRAYOF_STRING_NUMBER.min(3),
            ARRAYOF_STRING_NUMBER_3TO4_ITEMS = ARRAYOF_STRING_NUMBER_3_ITEMS.max(4);
        
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
        
        // containing types
        describe('itemTypes([type:string|Type]) restricted',
            function () {
                it('should cast([data:array[string|number]] to array with defined itemTypes()',
                    function () {
                        var data = ['test1', 1, 'test2', 2],
                            cast = ARRAYOF_STRING_NUMBER.cast(data);
                        
                        assert(cast instanceof Array,
                                'should convert array data to cast array');
                        
                        assert(cast[0] === data[0],
                                'should convert data item with the same cast item');
                        
                        assert(cast[1] === data[1],
                                'should convert data item with the same cast item');
                        
                        assert(cast[2] === data[2],
                                'should convert data item with the same cast item');
                        
                        assert(cast[3] === data[3],
                                'should convert data item with the same cast item');
                        
                        
                        data = ['test1', new Date(), 'test2', 2];
                        cast = ARRAYOF_STRING_NUMBER.cast(data);
                        
                        assert(cast[1] === void(0),
                                'should convert unregistered itemType item with undefined');
                        
                    });
                
                it('should validate([data:array[string|number]])',
                    function () {
                        var valid = ARRAYOF_STRING_NUMBER.validate(
                                        ['test1', 1, 'test2', 2]
                                    );
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid [data:array[string|number]]');

                    });
                
                it('should not validate([data:array[mixed]) other than [data:array[string|number]]',
                    function () {
                        var valid = ARRAYOF_STRING_NUMBER.validate(
                                        ['test1', new Date(), 'test2', 2]
                                    );
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should not be a valid [data:array[string|number]]');
                    });
            });
        
        // min(2)
        describe('min([data:number]) minimum list length',
            function () {
                it('should convert [data:array] to have minimum items by undefined filling it',
                    function () {
                        var cast = ARRAYOF_STRING_NUMBER_3_ITEMS.cast(["test1"]);
                        
                        assert(cast.length >= 3,
                            'should have a minimum or more items in array');
                        
                    })
                
                it('should apply minimum [data:array] items validation',
                    function () {
                        var valid = ARRAYOF_STRING_NUMBER_3_ITEMS.validate(["test1"]);
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should be a valid array having a minimum or more items');
                        
                        valid = ARRAYOF_STRING_NUMBER_3_ITEMS.validate(["test1", 1, "4"]);
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid array having exactly minimum items');
                        
                    })
            });
        
        // max(4)
        describe('max([data:number]) maximum list length',
            function () {
                it('should convert [data:array] to have maximum items by truncating the list',
                    function () {
                        var cast = ARRAYOF_STRING_NUMBER_3TO4_ITEMS.cast(
                                        ['test1', 1, 'test2', 2, 190, '180']
                                    );
                        assert(cast.length <= 4,
                            'should have a maximum or less items in array');
                        
                    })
                
                it('should apply minimum [data:array] items validation',
                    function () {
                        var valid = ARRAYOF_STRING_NUMBER_3TO4_ITEMS.validate(
                                        ['test1', 1, 'test2', 2, 190, '180']
                                    );
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error !== false,
                            'should be a valid array having a maximum or less items in array');
                        
                        valid = ARRAYOF_STRING_NUMBER_3TO4_ITEMS.validate(
                                        ['test1', 1, 'test2', 2]
                                    );
                        
                        assert(Object.prototype.toString.call(valid) === '[object Object]',
                            'should return validation object');
                        
                        assert(valid.error === false,
                            'should be a valid array having exactly maximum or less items in array');
                        
                    });
            });
    });